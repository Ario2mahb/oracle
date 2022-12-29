// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;
pragma experimental ABIEncoderV2;

import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "../interfaces/VBep20Interface.sol";
import "../interfaces/AggregatorV2V3Interface.sol";
import "../interfaces/OracleInterface.sol";

struct TokenConfig {
    /// @notice underlying token address, which can't be zero address and can be used for existance check
    /// @notice 0xbBbBBBBbbBBBbbbBbbBbbbbBBbBbbbbBbBbbBBbB for BNB
    address asset;
    /// @notice chainlink feed address
    address feed;
    /// @notice expiration period of this asset
    uint256 maxStalePeriod;
}

contract ChainlinkOracle is OwnableUpgradeable, OracleInterface {
    /// @notice VAI token is considered $1 constantly in oracle for now
    uint256 public constant VAI_VALUE = 1e18;

    /// @notice vBNB address
    /// @custom:oz-upgrades-unsafe-allow state-variable-immutable
    address public immutable vBnb;

    /// @notice Set this as asset address for BNB. This is the underlying for vBNB
    address public constant BNB_ADDR = 0xbBbBBBBbbBBBbbbBbbBbbbbBBbBbbbbBbBbbBBbB;

    /// @notice TODO: might be removed some day, it's for enabling us to force set the prices to
    /// certain values in some urgent conditions
    mapping(address => uint256) public prices;

    /// @notice token config by assets
    mapping(address => TokenConfig) public tokenConfigs;

    /// @notice emit when forced price is set
    event PricePosted(
        address asset,
        uint256 previousPriceMantissa,
        uint256 requestedPriceMantissa,
        uint256 newPriceMantissa
    );

    /// @notice emit when token config is added
    event TokenConfigAdded(address asset, address feed, uint256 maxStalePeriod);

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

    /// @notice Initializes the owner of the contract
    function initialize() public initializer {
        __Ownable_init();
    }

    /**
     * @notice Get the Chainlink price of underlying asset of input vToken, revert when vToken is zero address
     * @param vToken vToken address
     * @return price in USD
     */
    function getUnderlyingPrice(address vToken) public view override returns (uint256) {
        string memory symbol = address(vToken) != vBnb ? VBep20Interface(vToken).symbol() : "BNB";

        if (_compareStrings(symbol, "VAI")) {
            return VAI_VALUE;
            // @TODO: This is some history code, keep it here in case of messing up
        } else {
            return _getUnderlyingPriceInternal(VBep20Interface(vToken));
        }
    }

    /**
     * @notice Get the Chainlink price of underlying asset of input vToken or cached price when it's been set
     * @dev The decimals of underlying tokens is considered to ensure the returned prices are in 18 decimals
     * @param vToken vToken address
     * @return price in USD
     */
    function _getUnderlyingPriceInternal(VBep20Interface vToken) internal view returns (uint256 price) {
        address token;
        uint256 decimals;

        // VBNB token doesn't have `underlying` method
        if (address(vToken) == vBnb) {
            token = BNB_ADDR;
            decimals = 18;
        } else {
            token = vToken.underlying();
            decimals = VBep20Interface(token).decimals();
        }

        if (prices[token] != 0) {
            price = prices[token];
        } else {
            price = _getChainlinkPrice(token);
        }

        uint256 decimalDelta = uint256(18) - uint256(decimals);
        return price * (10 ** decimalDelta);
    }

    /**
     * @notice Get the Chainlink price of underlying asset of input vToken, revert if token config doesn't exit
     * @dev The decimals of feeds are considered
     * @param asset underlying asset address
     * @return price in USD, with 18 decimals
     */
    function _getChainlinkPrice(
        address asset
    ) internal view notNullAddress(tokenConfigs[asset].asset) returns (uint256) {
        TokenConfig storage tokenConfig = tokenConfigs[asset];
        AggregatorV2V3Interface feed = AggregatorV2V3Interface(tokenConfig.feed);

        // note: maxStalePeriod cannot be 0
        uint256 maxStalePeriod = tokenConfig.maxStalePeriod;

        // Chainlink USD-denominated feeds store answers at 8 decimals, mostly
        uint256 decimalDelta = uint256(18) - feed.decimals();

        (, int256 answer, , uint256 updatedAt, ) = feed.latestRoundData();
        require(answer > 0, "chainlink price must be positive");

        require(block.timestamp > updatedAt, "updatedAt exceeds block time");
        uint256 deltaTime = block.timestamp - updatedAt;
        require(deltaTime <= maxStalePeriod, "chainlink price expired");

        return uint256(answer) * (10 ** decimalDelta);
    }

    /**
     * @notice Set the forced prices of the underlying token of input vToken
     * @param vToken vToken address
     * @param underlyingPriceMantissa price in 18 decimals
     */
    function setUnderlyingPrice(VBep20Interface vToken, uint256 underlyingPriceMantissa) external onlyOwner {
        address asset = address(vToken) == vBnb ? BNB_ADDR : address(vToken.underlying());
        emit PricePosted(asset, prices[asset], underlyingPriceMantissa, underlyingPriceMantissa);
        prices[asset] = underlyingPriceMantissa;
    }

    /**
     * @notice Set the forced prices of the input token
     * @param asset asset address
     * @param price price in 18 decimals
     */
    function setDirectPrice(address asset, uint256 price) external onlyOwner {
        emit PricePosted(asset, prices[asset], price, price);
        prices[asset] = price;
    }

    /**
     * @notice Add multiple token configs at the same time
     * @param tokenConfigs_ config array
     */
    function setTokenConfigs(TokenConfig[] memory tokenConfigs_) external onlyOwner {
        require(tokenConfigs_.length > 0, "length can't be 0");
        for (uint256 i = 0; i < tokenConfigs_.length; i++) {
            setTokenConfig(tokenConfigs_[i]);
        }
    }

    /**
     * @notice Add single token config, vToken & feed cannot be zero address, and maxStalePeriod must be positive
     * @param tokenConfig token config struct
     */
    function setTokenConfig(
        TokenConfig memory tokenConfig
    ) public onlyOwner notNullAddress(tokenConfig.asset) notNullAddress(tokenConfig.feed) {
        require(tokenConfig.maxStalePeriod > 0, "stale period can't be zero");
        tokenConfigs[tokenConfig.asset] = tokenConfig;
        emit TokenConfigAdded(tokenConfig.asset, tokenConfig.feed, tokenConfig.maxStalePeriod);
    }

    function _compareStrings(string memory a, string memory b) internal pure returns (bool) {
        return (keccak256(abi.encodePacked((a))) == keccak256(abi.encodePacked((b))));
    }
}
