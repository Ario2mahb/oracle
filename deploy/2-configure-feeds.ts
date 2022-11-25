import { BigNumber } from "ethers";
import hre from "hardhat";
import { DeployFunction } from "hardhat-deploy/dist/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";

import { ResilientOracle } from "../src/types/contracts/ResilientOracle";
import { BoundValidator } from "../src/types/contracts/oracles/BoundValidator";

interface Feed {
  [key: string]: string;
}

interface Config {
  [key: string]: Feed;
}

const pythID: Config = {
  bsctestnet: {
    BNX: "0x843b251236e67259c6c82145bd68fb198c23e7cba5e26c995e39d8257fbf8eb8",
    BSW: "0x484efc34ed7311f56c1ac389a88d052dcddda88fe26fb8a876022c5b490f9c98",
  },
};

const chainlinkFeed: Config = {
  bsctestnet: {
    BNX: "0xf51492DeD1308Da8195C3bfcCF4a7c70fDbF9daE",
  },
};

const assets: Config = {
  bsctestnet: {
    BNX: "0xa57b4AefA16De8318603822219908173Ef04A364",
    BSW: "0x57931bB7CA29dF22E1a7bF43dB0e3D137ccb0C84",
  },
};

const addr0000 = "0x0000000000000000000000000000000000000000";
const DEFAULT_STALE_PERIOD = 1200; //20 min

const func: DeployFunction = async function ({ network }: HardhatRuntimeEnvironment) {
  const networkName: string = network.name === "bscmainnet" ? "bscmainnet" : "bsctestnet";

  const resilientOracle: ResilientOracle = await hre.ethers.getContract("ResilientOracle");
  const pythOracle = await hre.ethers.getContract("PythOracle");
  const chainlinkOracle = await hre.ethers.getContract("ChainlinkOracle");
  const boundValidator: BoundValidator = await hre.ethers.getContract("BoundValidator");

  //configure BNX
  console.log("Configure BNX");

  let tx;
  console.log("Configuring BNX on Chainlink");
  if (network.live) {
    tx = await chainlinkOracle.setTokenConfig({
      asset: assets[networkName]["BNX"],
      feed: chainlinkFeed[networkName]["BNX"],
      maxStalePeriod: DEFAULT_STALE_PERIOD,
    });

    await tx.wait(1);

    console.log("Configuring BNX on Pyth");
    tx = await pythOracle.setTokenConfig({
      pythId: pythID[networkName]["BNX"],
      asset: assets[networkName]["BNX"],
      maxStalePeriod: DEFAULT_STALE_PERIOD,
    });
    await tx.wait(1);

    console.log("Configuring Resilient Oracle");
    tx = await resilientOracle.setTokenConfig({
      asset: assets[networkName]["BNX"],
      oracles: [chainlinkOracle.address, pythOracle.address, addr0000],
      enableFlagsForOracles: [true, true, false],
    });
  } else {
    const mockBNX = await hre.ethers.getContract("MockBNX");
    tx = await resilientOracle.setTokenConfig({
      asset: mockBNX.address,
      oracles: [chainlinkOracle.address, addr0000, pythOracle.address],
      enableFlagsForOracles: [true, false, true],
    });
    await tx.wait(1);

    console.log("Configuring mock Chainlink price for BNX");

    tx = await resilientOracle.setOracle(mockBNX.address, chainlinkOracle.address, 0);
    await tx.wait(1);

    tx = await chainlinkOracle.setPrice(mockBNX.address, "159990000000000000000");
    await tx.wait(1);

    console.log("Configuring mock Pyth price for BNX");
    tx = await pythOracle.setPrice(mockBNX.address, "159990000000000000000");
    await tx.wait(1);
  }

  console.log("Configuring Bound Validator");
  tx = await boundValidator.setValidateConfig({
    asset: assets[networkName]["BNX"],
    upperBoundRatio: BigNumber.from(105).pow(18),
    lowerBoundRatio: BigNumber.from(95).pow(18),
  });

  await tx.wait(1);

  //configure BSW
  console.log("Configure BSW");

  if (network.live) {
    console.log("Configuring BSW on Pyth");
    tx = await pythOracle.setTokenConfig({
      pythId: pythID[networkName]["BSW"],
      asset: assets[networkName]["BSW"],
      maxStalePeriod: DEFAULT_STALE_PERIOD,
    });
    await tx.wait(1);
  } else {
    const mockBSW = await hre.ethers.getContract("MockBSW");

    tx = await resilientOracle.setTokenConfig({
      asset: mockBSW.address,
      oracles: [chainlinkOracle.address, addr0000, pythOracle.address],
      enableFlagsForOracles: [true, false, true],
    });
    await tx.wait(1);

    console.log("Configuring mock Pyth price for BSW");
    tx = await resilientOracle.setOracle(mockBSW.address, pythOracle.address, 0);
    await tx.wait(1);

    tx = await pythOracle.setPrice(mockBSW.address, "208000000000000000");
    await tx.wait(1);
  }

  console.log("Configuring Resilient Oracle");
  tx = await resilientOracle.setTokenConfig({
    asset: assets[networkName]["BSW"],
    oracles: [pythOracle.address, addr0000, addr0000],
    enableFlagsForOracles: [true, false, false],
  });

  await tx.wait(1);
};

export default func;
