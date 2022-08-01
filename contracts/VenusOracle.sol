// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;
pragma experimental ABIEncoderV2;

import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "./interfaces/OracleInterface.sol";


contract VenusOracle is Ownable, Pausable {
    using SafeMath for uint256;

    uint256 public constant INVALID_PRICE = 0;

    /**
     * @dev oracle role, we have 3 roles at the moment
     * MAIN: The most trustworthy price source
     * PIVOT: Not so trustworthy price source, used as a loose sanity checker
     * FALLBACK: The backup source when main oracle price is invalidated
     */
    enum OracleRole {
        MAIN,
        PIVOT,
        FALLBACK
    }

    struct TokenConfig {
        address[3] oracles;
        bool[3] enables;
    }

    mapping(address => TokenConfig) private tokenConfigs;

    event GlobalEnable(bool indexed isEnable);
    event TokenConfigAdded(
        address indexed token,
        address indexed mainOracle, 
        address indexed pivotOracle, 
        address fallbackOracle
    );
    event OracleSet(address indexed vToken, address indexed oracle, uint indexed role);
    event OracleEnabled(address indexed vToken, uint indexed role, bool indexed enable);

    modifier notNullAddress(address someone) {
        require(someone != address(0), "can't be zero address");
        _;
    }

    /**
     * @notice Check whether token config exist by checking whether main oracle is zero address
     * @dev main oracle can't be set to zero, so it's suitable to be used to check
     * @param vToken vtoken address
     * @param exist check existance or not 
     */
    modifier checkTokenConfigExistance(address vToken, bool exist) {
        address mainOracle = tokenConfigs[vToken].oracles[uint(OracleRole.MAIN)];
        if (exist) {
            require(mainOracle != address(0), "token config must exist");
        } else {
            require(mainOracle == address(0), "token config must not exist");
        }
        _;
    }

    /**
     * @dev Get token config by vToken address 
     * @param vToken vtoken address
     */
    function getTokenConfig(address vToken) public view returns (TokenConfig memory) {
        return tokenConfigs[vToken];
    }

    /**
     * @notice Get oracle & enabling status by vToken address 
     * @param vToken vtoken address
     * @param role oracle role
     */
    function getOracle(address vToken, OracleRole role) public view returns (address oracle, bool enabled) {
        oracle = tokenConfigs[vToken].oracles[uint(role)];
        enabled = tokenConfigs[vToken].enables[uint(role)];
    }

    /**
     * @notice Batch set token configs
     * @param vTokens vToken array
     * @param tokenConfigs_ token config array
     */
    function addTokenConfigs(address[] memory vTokens, TokenConfig[] memory tokenConfigs_) public onlyOwner() {
        require(vTokens.length == tokenConfigs_.length, "length doesn't match");
        require(vTokens.length != 0, "length can't be 0");
        for (uint256 i = 0; i < vTokens.length; i++) {
            addTokenConfig(vTokens[i], tokenConfigs_[i]);
        }
    }

    /**
     * @notice Set single token configs, vToken MUST have NOT be added before, and main oracle MUST not be zero address
     * @param vToken vToken address
     * @param tokenConfig token config struct
     */
    function addTokenConfig(address vToken, TokenConfig memory tokenConfig) public 
        onlyOwner()
        notNullAddress(vToken)
        notNullAddress(tokenConfig.oracles[uint(OracleRole.MAIN)])
        checkTokenConfigExistance(vToken, false)
    {
        tokenConfigs[vToken] = tokenConfig;
        emit TokenConfigAdded(
            vToken,
            tokenConfig.oracles[uint(OracleRole.MAIN)],
            tokenConfig.oracles[uint(OracleRole.PIVOT)],
            tokenConfig.oracles[uint(OracleRole.FALLBACK)]
        );
    }

    /**
     * @notice Set oracle of any type for the input vToken, input vToken MUST exist
     * @param vToken vToken address
     * @param oracle oracle address
     * @param role oracle role
     */
    function setOracle(address vToken, address oracle, OracleRole role) public
        onlyOwner()
        notNullAddress(vToken)
        notNullAddress(oracle)
        checkTokenConfigExistance(vToken, true)
    {
        tokenConfigs[vToken].oracles[uint(role)] = oracle;
        emit OracleSet(vToken, oracle, uint(role));
    }

    /**
     * @notice Enable/disable oracle for the input vToken, input vToken MUST exist
     * @param vToken vToken address
     * @param role oracle role
     * @param enable expected status
     */
    function enableOracle(address vToken, OracleRole role, bool enable) public
        onlyOwner()
        notNullAddress(vToken)
        checkTokenConfigExistance(vToken, true)
    {
        tokenConfigs[vToken].enables[uint(role)] = enable;
        emit OracleEnabled(vToken, uint(role), enable);
    }

    /**
     * @notice Get price of underlying asset of the input vToken, check flow:
     * - check the global pausing status
     * - check price from main oracle
     * - check price against pivot oracle, if any
     * - if fallback flag is enabled and price is invalidated, fallback
     * @param vToken vToken address
     */
    function getUnderlyingPrice(address vToken) external view returns (uint256) {
        // Global emergency switch
        if (paused()) {
            return INVALID_PRICE;
        }

        (address mainOracle, bool mainOracleEnabled) = getOracle(vToken, OracleRole.MAIN);

        uint price = INVALID_PRICE;

        // If tokenConfig doesn't exist or main oracle is not enabled, return
        if (mainOracle == address(0) || !mainOracleEnabled) {
            return price;
        }

        price = OracleInterface(mainOracle).getUnderlyingPrice(vToken);

        (address pivotOracle, bool pivotOracleEnabled) = getOracle(vToken, OracleRole.PIVOT);
        
        // Price oracle is not mandantory
        if (pivotOracle == address(0) || !pivotOracleEnabled) {
            return price;
        }

        // Check the price with pivot oracle
        bool pass = PivotOracleInterface(pivotOracle).validatePrice(vToken, price);
        if (!pass) {
            return INVALID_PRICE;
        }

        (address fallbackOracle, bool fallbackEnabled) = getOracle(vToken, OracleRole.FALLBACK);
        if (price == INVALID_PRICE && fallbackEnabled && fallbackOracle != address(0)) {
            return OracleInterface(fallbackOracle).getUnderlyingPrice(vToken);
        }

        return price;
    }
}