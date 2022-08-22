// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;
pragma experimental ABIEncoderV2;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "../libraries/PancakeLibrary.sol";
import "../interfaces/OracleInterface.sol";


struct Observation {
    uint256 timestamp;
    uint256 acc;
}

struct TokenConfig {
    /// @notice vToken address, which can't be zero address and can be used for existance check
    address vToken;
    /// @notice Decimals of underlying asset
    uint256 baseUnit;
    /// @notice The address of pancake pair
    address pancakePool;
    /// @notice Whether the token is paired with WBNB
    bool isBnbBased;
    /// @notice A flag identifies whether the pancake pair is reversed
    /// e.g. XVS-WBNB is not reversed, while WBNB-XVS is.
    bool isReversedPool;
    /// @notice TWAP update period in second, which is the minimum time in seconds required to update TWAP window
    uint256 anchorPeriod;
}

contract TwapOracle is Ownable, OracleInterface {
    using SafeMath for uint256;
    using FixedPoint for *;

    /// @notice vBNB address
    address public constant VBNB = address(0xA07c5b74C9B40447a954e1466938b865b6BBea36);

    /// @notice the base unit of WBNB and BUSD, which are the paired tokens for all assets
    uint256 public constant bnbBaseUnit = 1e18;
    uint256 public constant busdBaseUnit = 1e18;

    uint256 public constant expScale = 1e18;

    /// @notice Configs by token
    mapping(address => TokenConfig) public tokenConfigs;

    /// @notice The current price observation of TWAP. With old and current observations
    /// we can calculate the TWAP between this range
    mapping(address => Observation) public newObservations;

    /// @notice The old price observation of TWAP
    mapping(address => Observation) public oldObservations;

    /// @notice Stored price by token 
    mapping(address => uint256) public prices;

    /// @notice Emit this event when TWAP window is updated
    event TwapWindowUpdated(
        address indexed vToken, 
        uint256 oldTimestamp, 
        uint256 oldAcc, 
        uint256 newTimestamp, 
        uint256 newAcc);

    /// @notice Emit this event when TWAP price is updated
    event AnchorPriceUpdated(
        address indexed vToken,
        uint256 price, 
        uint256 oldTimestamp, 
        uint256 newTimestamp
    );

    /// @notice Emit this event when new token configs are added
    event TokenConfigAdded(
        address indexed vToken, 
        address indexed pancakePool,
        uint256 indexed anchorPeriod
    );

    modifier notNullAddress(address someone) {
        require(someone != address(0), "can't be zero address");
        _;
    }

    /**
     * @notice Add multiple token configs at the same time
     * @param configs config array
     */
    function addTokenConfigs(TokenConfig[] memory configs) external onlyOwner() {
        require(configs.length > 0, "length can't be 0");
        for (uint8 i = 0; i < configs.length; i++) {
            addTokenConfig(configs[i]);
        }
    }

    /**
     * @notice Add single token configs
     * @param config token config struct
     */
    function addTokenConfig(TokenConfig memory config) public 
        onlyOwner()
        notNullAddress(config.vToken)
        notNullAddress(config.pancakePool)
    {
        require(tokenConfigs[config.vToken].vToken == address(0), "token config must not exist");
        require(config.anchorPeriod > 0, "anchor period must be positive");
        require(config.baseUnit > 0, "base unit must be positive");
        uint256 cumulativePrice = currentCumulativePrice(config);

        // Initialize observation data
        oldObservations[config.vToken].timestamp = block.timestamp;
        newObservations[config.vToken].timestamp = block.timestamp;
        oldObservations[config.vToken].acc = cumulativePrice;
        newObservations[config.vToken].acc = cumulativePrice;
        tokenConfigs[config.vToken] = config;
        emit TokenConfigAdded(
            config.vToken, 
            config.pancakePool,
            config.anchorPeriod
        );
    }

    /**
     * @notice Get the underlying TWAP price of input vToken
     * @param vToken vToken address
     * @return price in USD, with 18 decimals
     */
    function getUnderlyingPrice(address vToken) external override view returns (uint256) {
        require(tokenConfigs[vToken].vToken != address(0), "vToken not exist");
        return prices[vToken];
    }

    /**
     * @notice Fetches the current token/WBNB and token/BUSD price accumulator from pancakeswap.
     * @return cumulative price of target token regardless of pair order 
     */
    function currentCumulativePrice(TokenConfig memory config) public view returns (uint256) {
        (uint256 price0, uint256 price1,) = PancakeOracleLibrary.currentCumulativePrices(config.pancakePool);
        if (config.isReversedPool) {
            return price1;
        } else {
            return price0;
        }
    }

    function updateTwap(address vToken) public returns (uint256) {
        require(tokenConfigs[vToken].vToken != address(0), "vTokne not exist");
        // Update & fetch WBNB price first, so we can calculate the price of WBNB paired token
        if (vToken != VBNB && tokenConfigs[vToken].isBnbBased) {
            updateTwap(VBNB);
        }
        return updateTwapInternal(tokenConfigs[vToken]);
    }

    /**
     * @notice Fetches the current token/BUSD price from PancakeSwap, with 18 decimals of precision.
     * @return price in USD, with 18 decimals
     */
    function updateTwapInternal(TokenConfig memory config) internal virtual returns (uint256) {
        // pokeWindowValues already handled reversed pool cases, 
        // priceAverage will always be Token/BNB or Token/BUSD TWAP price.
        (uint256 nowCumulativePrice, uint256 oldCumulativePrice, uint256 oldTimestamp) = pokeWindowValues(config);

        // This should be impossible, but better safe than sorry
        require(block.timestamp > oldTimestamp, "now must come after before");
        uint256 timeElapsed = block.timestamp.sub(oldTimestamp);

        // Calculate Pancakge TWAP
        FixedPoint.uq112x112 memory priceAverage = FixedPoint.uq112x112(uint224(
            nowCumulativePrice.sub(oldCumulativePrice).div(timeElapsed)
        ));
        // TWAP price with 1e18 decimal mantissa
        uint256 priceAverageMantissa = priceAverage.decode112with18();

        // To cancel the decimals in cumulative price, we need to mulitply the average price with 
        // tokenBaseUnit / (wbnbBaseUnit or busdBaseUnit, which is 1e18)
        uint256 pairedTokenBaseUnit = config.isBnbBased ? bnbBaseUnit : busdBaseUnit;
        uint256 anchorPriceMantissa = priceAverageMantissa.mul(config.baseUnit).div(pairedTokenBaseUnit);

        // if this token is paired with BNB, convert its price to USD
        if (config.isBnbBased) {
            uint256 bnbPrice = prices[VBNB];
            require(bnbPrice != 0, "bnb price is invalid");
            anchorPriceMantissa = anchorPriceMantissa.mul(bnbPrice).div(bnbBaseUnit);
        }

        require(anchorPriceMantissa != 0, "twap price cannot be 0");

        emit AnchorPriceUpdated(config.vToken, anchorPriceMantissa, oldTimestamp, block.timestamp);
        
        // save anchor price, which is 1e18 decimals
        prices[config.vToken] = anchorPriceMantissa;

        return anchorPriceMantissa;
    }

    /**
     * @notice Update new and old observations of lagging window if period elapsed.
     * @return cumulative price & old observation
     */
    function pokeWindowValues(TokenConfig memory config) internal returns (uint256, uint256, uint256) {
        uint256 cumulativePrice = currentCumulativePrice(config);

        Observation memory newObservation = newObservations[config.vToken];

        // Update new and old observations if elapsed time is greater than or equal to anchor period
        uint256 timeElapsed = block.timestamp.sub(newObservation.timestamp);
        if (timeElapsed >= config.anchorPeriod) {
            oldObservations[config.vToken].timestamp = newObservation.timestamp;
            oldObservations[config.vToken].acc = newObservation.acc;

            newObservations[config.vToken].timestamp = block.timestamp;
            newObservations[config.vToken].acc = cumulativePrice;
            emit TwapWindowUpdated(
                config.vToken,
                newObservation.timestamp,
                block.timestamp, 
                newObservation.acc, 
                cumulativePrice
            );
        }
        return (cumulativePrice, oldObservations[config.vToken].acc, oldObservations[config.vToken].timestamp);
    }
}