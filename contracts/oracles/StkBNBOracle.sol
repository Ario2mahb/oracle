// SPDX-License-Identifier: BSD-3-Clause
pragma solidity 0.8.13;

import { OracleInterface } from "../interfaces/OracleInterface.sol";
import { IPStakePool } from "../interfaces/IPStakePool.sol";
import { ensureNonzeroAddress } from "@venusprotocol/solidity-utilities/contracts/validators.sol";
import { EXP_SCALE } from "@venusprotocol/solidity-utilities/contracts/constants.sol";
import { CorrelatedTokenOracle } from "./common/CorrelatedTokenOracle.sol";

/**
 * @title StkBNBOracle
 * @author Venus
 * @notice This oracle fetches the price of stkBNB asset
 */
contract StkBNBOracle is CorrelatedTokenOracle {
    /// @notice Address of StakePool
    /// @custom:oz-upgrades-unsafe-allow state-variable-immutable
    IPStakePool public immutable STAKE_POOL;

    /// @notice Constructor for the implementation contract.
    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor(
        address _stakePool,
        address _stkBNB,
        address _bnb,
        address _resilientOracle
    ) CorrelatedTokenOracle(_stkBNB, _bnb, _resilientOracle) {
        ensureNonzeroAddress(_stakePool);
        STAKE_POOL = IPStakePool(_stakePool);
    }

    /**
     * @notice Fetches the amount of BNB for 1 stkBNB
     * @return price The amount of BNB for stkBNB
     */
    function getUnderlyingAmount() internal view override returns (uint256) {
        IPStakePool.Data memory exchangeRateData = STAKE_POOL.exchangeRate();
        return (exchangeRateData.totalWei * EXP_SCALE) / exchangeRateData.poolTokenSupply;
    }
}
