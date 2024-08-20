// SPDX-License-Identifier: BSD-3-Clause
pragma solidity 0.8.25;

import { CorrelatedTokenOracle } from "./common/CorrelatedTokenOracle.sol";
import { IAccountant } from "../interfaces/IAccountant.sol";
import { ensureNonzeroAddress } from "@venusprotocol/solidity-utilities/contracts/validators.sol";

/**
 * @title WeETHAccountantOracle
 * @author Venus
 * @notice This oracle fetches the price of weETH LST
 */
contract WeETHAccountantOracle is CorrelatedTokenOracle {
    /// @notice Address of Accountant
    /// @custom:oz-upgrades-unsafe-allow state-variable-immutable
    IAccountant public immutable ACCOUNTANT;

    /// @notice Constructor for the implementation contract.
    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor(
        address accountant,
        address weethLST,
        address eth,
        address resilientOracle
    ) CorrelatedTokenOracle(weethLST, eth, resilientOracle) {
        ensureNonzeroAddress(accountant);
        ACCOUNTANT = IAccountant(accountant);
    }

    /**
     * @notice Gets the eETH for 1 weETH
     * @return amount Amount of eETH
     */
    function _getUnderlyingAmount() internal view override returns (uint256) {
        return ACCOUNTANT.getRate();
    }
}
