// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.13;

import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/utils/math/SafeCast.sol";
import "@openzeppelin/contracts/utils/math/SignedMath.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "../interfaces/PythInterface.sol";
import "../interfaces/OracleInterface.sol";
import "../interfaces/VBep20Interface.sol";

struct TokenConfig {
    bytes32 pythId;
    address asset;
    uint64 maxStalePeriod;
}

/**
 * PythOracle contract reads prices from actual Pyth oracle contract which accepts/verifies and stores the
 * updated prices from external sources
 */
contract PythOracle is OwnableUpgradeable, OracleInterface {
    using SafeMath for uint256;

    // To calculate 10 ** n(which is a signed type)
    using SignedMath for int256;

    // To cast int64/int8 types from Pyth to unsigned types
    using SafeCast for int256;

    /// @notice price decimals
    uint256 public constant EXP_SCALE = 1e18;

    /// @notice vBNB address
    /// @custom:oz-upgrades-unsafe-allow state-variable-immutable
    address public immutable vBnb;

    /// @notice Set this as asset address for BNB. This is the underlying for vBNB
    address public constant BNB_ADDR = 0xbBbBBBBbbBBBbbbBbbBbbbbBBbBbbbbBbBbbBBbB;

    /// @notice the actual pyth oracle address fetch & store the prices
    IPyth public underlyingPythOracle;

    /// @notice emit when setting a new pyth oracle address
    event PythOracleSet(address indexed newPythOracle);

    /// @notice emit when token config added
    event TokenConfigAdded(address indexed vToken, bytes32 indexed pythId, uint64 indexed maxStalePeriod);

    /// @notice token configs by asset address
    mapping(address => TokenConfig) public tokenConfigs;

    modifier notNullAddress(address someone) {
        require(someone != address(0), "can't be zero address");
        _;
    }

    /// @notice Constructor for the implementation contract. Sets immutable variables.
    /// @param vBnbAddress The address of the VBNB
    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor(address vBnbAddress) notNullAddress(vBnbAddress) {
        vBnb = vBnbAddress;
        _disableInitializers();
    }

    /**
     * @notice Initializes the owner of the contract and sets required contracts
     * @param underlyingPythOracle_ Address of the pyth oracle
     */
    function initialize(address underlyingPythOracle_) public initializer {
        __Ownable_init();
        require(underlyingPythOracle_ != address(0), "pyth oracle cannot be zero address");
        underlyingPythOracle = IPyth(underlyingPythOracle_);
        emit PythOracleSet(underlyingPythOracle_);
    }

    /**
     * @notice Batch set token configs
     * @param tokenConfigs_ token config array
     * @custom:access Only Governance
     * @custom:error Zero length error thrown, if length of the array in parameter is 0
     */
    function setTokenConfigs(TokenConfig[] memory tokenConfigs_) external onlyOwner {
        require(tokenConfigs_.length != 0, "length can't be 0");
        for (uint256 i; i < tokenConfigs_.length; ++i) {
            setTokenConfig(tokenConfigs_[i]);
        }
    }

    /**
     * @notice Set single token config, `maxStalePeriod` cannot be 0 and `vToken` can be zero address
     * @param tokenConfig token config struct
     * @custom:access Only Governance
     * @custom:error Range error thrown if max stale period is zero
     * @custom:error NotNullAddress error thrown if asset address is zero
     */
    function setTokenConfig(TokenConfig memory tokenConfig) public onlyOwner notNullAddress(tokenConfig.asset) {
        require(tokenConfig.maxStalePeriod != 0, "max stale period cannot be 0");
        tokenConfigs[tokenConfig.asset] = tokenConfig;
        emit TokenConfigAdded(tokenConfig.asset, tokenConfig.pythId, tokenConfig.maxStalePeriod);
    }

    /**
     * @notice set the underlying pyth oracle contract address
     * @param underlyingPythOracle_ pyth oracle contract address
     * @custom:access Only Governance
     * @custom:error NotNullAddress error thrown if underlyingPythOracle_ address is zero
     * @custom:event Emits PythOracleSet event with address of Pyth oracle.
     */
    function setUnderlyingPythOracle(
        IPyth underlyingPythOracle_
    ) external onlyOwner notNullAddress(address(underlyingPythOracle_)) {
        underlyingPythOracle = underlyingPythOracle_;
        emit PythOracleSet(address(underlyingPythOracle_));
    }

    /**
     * @notice Get price of underlying asset of the input vToken, under the hood this function
     * get price from Pyth contract, the prices of which are updated externally
     * @param vToken vToken address
     * @return price in 10 decimals
     * @custom:error Zero address error thrown if underlyingPythOracle address is zero
     * @custom:error Zero address error thrown if asset address is zero
     * @custom:error Range error thrown if price of pythoracle is not greater than zero
     */
    function getUnderlyingPrice(address vToken) public view override returns (uint256) {
        require(address(underlyingPythOracle) != address(0), "Pyth oracle is zero address");

        address asset;
        uint256 decimals;

        // VBNB token doesn't have `underlying` method
        if (address(vToken) == vBnb) {
            asset = BNB_ADDR;
            decimals = 18;
        } else {
            asset = VBep20Interface(vToken).underlying();
            decimals = VBep20Interface(asset).decimals();
        }

        TokenConfig storage tokenConfig = tokenConfigs[asset];
        require(tokenConfig.asset != address(0), "asset doesn't exist");

        // if the price is expired after it's compared against `maxStalePeriod`, the following call will revert
        PythStructs.Price memory priceInfo = underlyingPythOracle.getPriceNoOlderThan(
            tokenConfig.pythId,
            tokenConfig.maxStalePeriod
        );

        uint256 price = int256(priceInfo.price).toUint256();

        require(price > 0, "Pyth oracle price must be positive");

        // the price returned from Pyth is price ** 10^expo, which is the real dollar price of the assets
        // we need to multiply it by 1e18 to make the price 18 decimals
        if (priceInfo.expo > 0) {
            return price.mul(EXP_SCALE).mul(10 ** int256(priceInfo.expo).toUint256()) * (10 ** (18 - decimals));
        } else {
            return price.mul(EXP_SCALE).div(10 ** int256(-priceInfo.expo).toUint256()) * (10 ** (18 - decimals));
        }
    }
}
