// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;
pragma experimental ABIEncoderV2;

import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "./interfaces/VBep20Interface.sol";
import "./interfaces/AggregatorV2V3Interface.sol";

contract VenusChainlinkOracle {
    using SafeMath for uint256;
    uint256 public constant VAI_VALUE = 1e18;
    address public admin;

    mapping(address => uint256) internal prices;
    mapping(address => uint256) internal maxStalePeriods;
    mapping(bytes32 => AggregatorV2V3Interface) internal feeds;

    event PricePosted(
        address asset,
        uint256 previousPriceMantissa,
        uint256 requestedPriceMantissa,
        uint256 newPriceMantissa
    );
    event NewAdmin(address oldAdmin, address newAdmin);
    event FeedSet(address feed, string symbol, uint256 maxStalePeriod);

    constructor() {
        admin = msg.sender;
    }

    function getUnderlyingPrice(VBep20Interface vToken) public view returns (uint256) {
        string memory symbol = vToken.symbol();
        if (compareStrings(symbol, "vBNB")) {
            return getChainlinkPrice(getFeed(symbol));
        } else if (compareStrings(symbol, "VAI")) {
            return VAI_VALUE;
        } else if (compareStrings(symbol, "XVS")) {
            return prices[address(vToken)];
        } else {
            return getPrice(vToken);
        }
    }

    function getPrice(VBep20Interface vToken) internal view returns (uint256 price) {
        VBep20Interface token = VBep20Interface(vToken.underlying());

        if (prices[address(token)] != 0) {
            price = prices[address(token)];
        } else {
            price = getChainlinkPrice(getFeed(token.symbol()));
        }

        uint256 decimalDelta = uint256(18).sub(uint256(token.decimals()));
        // Ensure that we don't multiply the result by 0
        if (decimalDelta > 0) {
            return price.mul(10**decimalDelta);
        } else {
            return price;
        }
    }

    function getChainlinkPrice(AggregatorV2V3Interface feed) internal view returns (uint256) {
        // Chainlink USD-denominated feeds store answers at 8 decimals
        uint256 decimalDelta = uint256(18).sub(feed.decimals());

        (, int256 answer, , uint256 updatedAt, ) = feed.latestRoundData();

        // a feed with 0 max stale period or doesn't exist, return 0
        uint256 maxStalePeriod = maxStalePeriods[address(feed)];
        if (maxStalePeriod == 0) {
            return 0;
        }

        // Ensure that we don't multiply the result by 0
        if (block.timestamp.sub(updatedAt) > maxStalePeriod) {
            return 0;
        }

        if (decimalDelta > 0) {
            return uint256(answer).mul(10**decimalDelta);
        } else {
            return uint256(answer);
        }
    }

    function setUnderlyingPrice(VBep20Interface vToken, uint256 underlyingPriceMantissa) external onlyAdmin {
        address asset = address(vToken.underlying());
        emit PricePosted(asset, prices[asset], underlyingPriceMantissa, underlyingPriceMantissa);
        prices[asset] = underlyingPriceMantissa;
    }

    function setDirectPrice(address asset, uint256 price) external onlyAdmin {
        emit PricePosted(asset, prices[asset], price, price);
        prices[asset] = price;
    }

    function batchSetFeeds(
        string[] calldata symbols_,
        address[] calldata feeds_,
        uint256[] calldata maxStalePeriods_
    ) external onlyAdmin {
        require(symbols_.length == feeds_.length, "invalid length");
        require(symbols_.length == maxStalePeriods_.length, "invalid length");
        require(symbols_.length > 0, "empty feeds");
        for (uint256 i = 0; i < symbols_.length; i++) {
            setFeed(symbols_[i], feeds_[i], maxStalePeriods_[i]);
        }
    }

    function setFeed(
        string memory symbol,
        address feed,
        uint256 maxStalePeriod
    ) public onlyAdmin {
        require(feed != address(0) && feed != address(this), "invalid feed address");
        require(maxStalePeriod > 0, "stale period can't be zero");
        bytes32 symbolHash = keccak256(abi.encodePacked(symbol));
        feeds[symbolHash] = AggregatorV2V3Interface(feed);
        maxStalePeriods[feed] = maxStalePeriod;
        emit FeedSet(feed, symbol, maxStalePeriod);
    }

    function getFeed(string memory symbol) public view returns (AggregatorV2V3Interface) {
        return feeds[keccak256(abi.encodePacked(symbol))];
    }

    function getMaxStalePeriod(address asset) external view returns (uint256) {
        return maxStalePeriods[asset];
    }

    function assetPrices(address asset) external view returns (uint256) {
        return prices[asset];
    }

    function compareStrings(string memory a, string memory b) internal pure returns (bool) {
        return (keccak256(abi.encodePacked((a))) == keccak256(abi.encodePacked((b))));
    }

    function setAdmin(address newAdmin) external onlyAdmin {
        address oldAdmin = admin;
        admin = newAdmin;

        emit NewAdmin(oldAdmin, newAdmin);
    }

    modifier onlyAdmin() {
        require(msg.sender == admin, "only admin may call");
        _;
    }
}
