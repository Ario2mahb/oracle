// SPDX-License-Identifier: BSD-3-Clause
pragma solidity 0.8.13;

interface ISfrxETH {
    function convertToAssets(uint256 shares) external view returns (uint256);
}
