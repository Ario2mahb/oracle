/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { ethers } from "ethers";
import {
  FactoryOptions,
  HardhatEthersHelpers as HardhatEthersHelpersBase,
} from "@nomiclabs/hardhat-ethers/types";

import * as Contracts from ".";

declare module "hardhat/types/runtime" {
  interface HardhatEthersHelpers extends HardhatEthersHelpersBase {
    getContractFactory(
      name: "Ownable",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.Ownable__factory>;
    getContractFactory(
      name: "Pausable",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.Pausable__factory>;
    getContractFactory(
      name: "ERC20",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.ERC20__factory>;
    getContractFactory(
      name: "IERC20Metadata",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IERC20Metadata__factory>;
    getContractFactory(
      name: "IERC20",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IERC20__factory>;
    getContractFactory(
      name: "AggregatorV2V3Interface",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.AggregatorV2V3Interface__factory>;
    getContractFactory(
      name: "BEP20Interface",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.BEP20Interface__factory>;
    getContractFactory(
      name: "OracleInterface",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.OracleInterface__factory>;
    getContractFactory(
      name: "PivotOracleInterface",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.PivotOracleInterface__factory>;
    getContractFactory(
      name: "VBep20Interface",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.VBep20Interface__factory>;
    getContractFactory(
      name: "BEP20Harness",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.BEP20Harness__factory>;
    getContractFactory(
      name: "MockPivotOracle",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.MockPivotOracle__factory>;
    getContractFactory(
      name: "MockSimpleOracle",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.MockSimpleOracle__factory>;
    getContractFactory(
      name: "MockV3Aggregator",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.MockV3Aggregator__factory>;
    getContractFactory(
      name: "VBEP20Harness",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.VBEP20Harness__factory>;
    getContractFactory(
      name: "VenusChainlinkOracle",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.VenusChainlinkOracle__factory>;
    getContractFactory(
      name: "VenusOracle",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.VenusOracle__factory>;

    getContractAt(
      name: "Ownable",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.Ownable>;
    getContractAt(
      name: "Pausable",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.Pausable>;
    getContractAt(
      name: "ERC20",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.ERC20>;
    getContractAt(
      name: "IERC20Metadata",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IERC20Metadata>;
    getContractAt(
      name: "IERC20",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IERC20>;
    getContractAt(
      name: "AggregatorV2V3Interface",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.AggregatorV2V3Interface>;
    getContractAt(
      name: "BEP20Interface",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.BEP20Interface>;
    getContractAt(
      name: "OracleInterface",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.OracleInterface>;
    getContractAt(
      name: "PivotOracleInterface",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.PivotOracleInterface>;
    getContractAt(
      name: "VBep20Interface",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.VBep20Interface>;
    getContractAt(
      name: "BEP20Harness",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.BEP20Harness>;
    getContractAt(
      name: "MockPivotOracle",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.MockPivotOracle>;
    getContractAt(
      name: "MockSimpleOracle",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.MockSimpleOracle>;
    getContractAt(
      name: "MockV3Aggregator",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.MockV3Aggregator>;
    getContractAt(
      name: "VBEP20Harness",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.VBEP20Harness>;
    getContractAt(
      name: "VenusChainlinkOracle",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.VenusChainlinkOracle>;
    getContractAt(
      name: "VenusOracle",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.VenusOracle>;

    // default types
    getContractFactory(
      name: string,
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<ethers.ContractFactory>;
    getContractFactory(
      abi: any[],
      bytecode: ethers.utils.BytesLike,
      signer?: ethers.Signer
    ): Promise<ethers.ContractFactory>;
    getContractAt(
      nameOrAbi: string | any[],
      address: string,
      signer?: ethers.Signer
    ): Promise<ethers.Contract>;
  }
}
