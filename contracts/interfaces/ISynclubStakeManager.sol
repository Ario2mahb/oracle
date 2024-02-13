// SPDX-License-Identifier: BSD-3-Clause
pragma solidity 0.8.13;

interface ISynclubStakeManager {
    function convertSnBnbToBnb(uint256 _amount) external view returns (uint256);
}
