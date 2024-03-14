// SPDX-License-Identifier: BSD-3-Clause
pragma solidity 0.8.13;

import { ISynclubStakeManager } from "../interfaces/ISynclubStakeManager.sol";
import { ensureNonzeroAddress } from "@venusprotocol/solidity-utilities/contracts/validators.sol";
import { CorrelatedTokenOracle } from "./common/CorrelatedTokenOracle.sol";

/**
 * @title SlisBNBOracle
 * @author Venus
 * @notice This oracle fetches the price of slisBNB asset
 */
contract SlisBNBOracle is CorrelatedTokenOracle {
    /// @notice This is used as token address of BNB on BSC
    address public constant NATIVE_TOKEN_ADDR = 0xbBbBBBBbbBBBbbbBbbBbbbbBBbBbbbbBbBbbBBbB;

    /// @notice Address of StakeManager
    /// @custom:oz-upgrades-unsafe-allow state-variable-immutable
    ISynclubStakeManager public immutable STAKE_MANAGER;

    /// @notice Constructor for the implementation contract.
    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor(
        address stakeManager,
        address slisBNB,
        address resilientOracle
    ) CorrelatedTokenOracle(slisBNB, NATIVE_TOKEN_ADDR, resilientOracle) {
        ensureNonzeroAddress(stakeManager);
        STAKE_MANAGER = ISynclubStakeManager(stakeManager);
    }

    /**
     * @notice Fetches the amount of BNB for 1 slisBNB
     * @return amount The amount of BNB for slisBNB
     */
    function getUnderlyingAmount() internal view override returns (uint256) {
        return STAKE_MANAGER.convertSnBnbToBnb(1 ether);
    }
}
