// SPDX-License-Identifier: MIT
pragma solidity 0.8.13;

import { ChainlinkOracle } from "./ChainlinkOracle.sol";
import { AggregatorV3Interface } from "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

/**
    @title Arbitrum Chain Link Oracle
    @notice Oracle to fetch price using chainlink oracles on arbitrum
*/
contract ArbiChainlinkOracle is ChainlinkOracle {
    /// @notice L2 Sequencer feed
    AggregatorV3Interface public immutable sequencer;

    /// @notice L2 Sequencer grace period
    uint256 public constant GRACE_PERIOD_TIME = 3600;

    /**
        @notice Contract constructor
        @param _sequencer L2 sequencer
    */
    constructor(AggregatorV3Interface _sequencer) ChainlinkOracle() {
        sequencer = _sequencer;
    }

    /// @inheritdoc ChainlinkOracle
    function getPrice(address asset) public view override returns (uint) {
        if (!isSequencerActive()) revert("L2 sequencer unavailable");
        return super.getPrice(asset);
    }

    function isSequencerActive() internal view returns (bool) {
        (, int256 answer, uint256 startedAt, , ) = sequencer.latestRoundData();
        if (block.timestamp - startedAt <= GRACE_PERIOD_TIME || answer == 1) return false;
        return true;
    }
}
