import type { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";
import { expect } from "chai";
import { BigNumber } from "ethers";
import { artifacts, ethers, upgrades, waffle } from "hardhat";
import { PivotPythOracle } from "../src/types";
import { MockPyth } from "../src/types/contracts/test/MockPyth";
import { addr0000, addr1111, getBytes32String, getSimpleAddress } from "./utils/data";
import { makeVToken } from "./utils/makeVToken";
import { getTime, increaseTime } from "./utils/time";

const EXP_SCALE = BigNumber.from(10).pow(18);

const getPythOracle = async (account: SignerWithAddress) => {
  const actualOracleArtifact = await artifacts.readArtifact("MockPyth");
  const actualOracle = await waffle.deployContract(account, actualOracleArtifact, []);
  await actualOracle.deployed();

  const PivotPythOracle = await ethers.getContractFactory("PivotPythOracle", account);
  const instance = <PivotPythOracle>await upgrades.deployProxy(PivotPythOracle, [actualOracle.address]);
  return instance;
}

describe("Oracle plugin frame unit tests", function () {
  beforeEach(async function () {
    const signers: SignerWithAddress[] = await ethers.getSigners();
    const admin = signers[0];
    this.signers = signers;
    this.admin = admin;
    this.pythOracle = await getPythOracle(admin);
  });

  describe('constructor', function () {
    it('sets address of owner', async function () {
      const owner = await this.pythOracle.owner();
      expect(owner).to.equal(this.admin.address);
    });
  });

  describe('admin check', function () {
    it('only admin can call the setters', async function () {
      const config = {
        pythId: getBytes32String(2),
        vToken: addr1111,
        maxStalePeriod: 10,
      };
      // setTokenConfigs
      await expect(
        this.pythOracle.connect(this.signers[2]).setTokenConfigs([config])
      ).to.be.revertedWith("Ownable: caller is not the owner");

      // setTokenConfig
      await expect(
        this.pythOracle.connect(this.signers[1]).setTokenConfig(config)
      ).to.be.revertedWith("Ownable: caller is not the owner");

      // setOracle
      await expect(
        this.pythOracle.connect(this.signers[2]).setUnderlyingPythOracle(addr1111)
      ).to.be.revertedWith("Ownable: caller is not the owner");
    })

    it('transfer owner', async function () {
      const config = {
        pythId: getBytes32String(2),
        vToken: addr1111,
        maxStalePeriod: 10,
      };
      await this.pythOracle.transferOwnership(this.signers[2].address);
      const newOwner = await this.pythOracle.owner();
      expect(newOwner).to.equal(this.signers[2].address);
      await this.pythOracle.connect(this.signers[2]).setTokenConfigs([config]);
      expect((await this.pythOracle.tokenConfigs(addr1111)).vToken).to.equal(addr1111);
    })
  });

  describe('token config', function () {
    describe('add single token config', function () {
      it('vToken can"t be zero & maxStalePeriod can\'t be zero', async function () {
        await expect(
          this.pythOracle.setTokenConfig({
            pythId: getBytes32String(2),
            vToken: addr0000,
            maxStalePeriod: 10,
          })
        ).to.be.revertedWith("can't be zero address");
        
        await expect(
          this.pythOracle.setTokenConfig({
            pythId: getBytes32String(2),
            vToken: addr1111,
            maxStalePeriod: 0,
          })
        ).to.be.revertedWith("max stale period cannot be 0");
      });

      it('token config added successfully & events check', async function () {
        const result = await this.pythOracle.setTokenConfig({
          vToken: addr1111,
          pythId: getBytes32String(2),
          maxStalePeriod: 111,
        });
        await expect(result).to.emit(this.pythOracle, 'TokenConfigAdded').withArgs(
          addr1111, getBytes32String(2), 111
        )
      });
    })

    describe('batch add token configs', function () {
      it('length check', async function () {
        await expect(
          this.pythOracle.setTokenConfigs([])
        ).to.be.revertedWith("length can't be 0");
      })

      it('token config added successfully & data check', async function () {
        await this.pythOracle.setTokenConfigs([{
          vToken: addr1111,
          pythId: getBytes32String(2),
          maxStalePeriod: 111,
        }, {
          vToken: getSimpleAddress(2),
          pythId: getBytes32String(3),
          maxStalePeriod: 222,
        }]);
        expect((await this.pythOracle.tokenConfigs(addr1111)).vToken).to.equal(addr1111);
        expect((await this.pythOracle.tokenConfigs(getSimpleAddress(2))).maxStalePeriod).to.equal(222);
      })
    });

  });


  describe('get underlying price', function () {
    beforeEach(async function () {
      const underlyingPythAddress = await this.pythOracle.underlyingPythOracle();
      const UnderlyingPythFactory = await ethers.getContractFactory('MockPyth');
      const underlyingPyth = UnderlyingPythFactory.attach(underlyingPythAddress);
      this.underlyingPythOracle = <MockPyth>underlyingPyth;
      const ts = await getTime();
      // update some feeds
      await this.underlyingPythOracle.updatePriceFeedsHarness([{
        id: getBytes32String(1),
        productId: getBytes32String(1),
        price: BigNumber.from(10000000), // 10000000 * 10 ** -6 = $10
        conf: 10,
        expo: -6,
        status: 0,
        maxNumPublishers: 0,
        numPublishers: 0,
        emaPrice: 0,
        emaConf: 0,
        publishTime: ts,
        prevPrice: 0,
        prevConf: 0,
        prevPublishTime: 0,
      }, {
        id: getBytes32String(2),
        productId: getBytes32String(2),
        price: BigNumber.from(1), // 10000000 * 10 ** 8 = $100
        conf: 10,
        expo: 2,
        status: 0,
        maxNumPublishers: 0,
        numPublishers: 0,
        emaPrice: 0,
        emaConf: 0,
        publishTime: ts,
        prevPrice: 0,
        prevConf: 0,
        prevPublishTime: 0,
      }])
    })
    it('revert when vToken not exist', async function () {
      await expect(
        this.pythOracle.getUnderlyingPrice(addr1111)
      ).to.be.revertedWith("vToken doesn't exist");
    })

    it('revert when price is expired', async function () {
      await this.pythOracle.setTokenConfig({
        vToken: addr1111,
        pythId: getBytes32String(2),
        maxStalePeriod: 111,
      });
      await increaseTime(120);
      await expect(
        this.pythOracle.getUnderlyingPrice(addr1111)
      ).to.be.revertedWith("No available price within given duration");
    })

    it('revert when price is not positive (just in case Pyth return insane data)', async function () {
      const ts = await getTime();
      const feed = {
        id: getBytes32String(3),
        productId: getBytes32String(1),
        price: BigNumber.from(-10),
        conf: 10,
        expo: BigNumber.from(-10),
        status: 0,
        maxNumPublishers: 0,
        numPublishers: 0,
        emaPrice: 0,
        emaConf: 0,
        publishTime: ts,
        prevPrice: 0,
        prevConf: 0,
        prevPublishTime: 0,
      };
      await this.underlyingPythOracle.updatePriceFeedsHarness([feed]);

      await this.pythOracle.setTokenConfig({
        vToken: addr1111,
        pythId: getBytes32String(3),
        maxStalePeriod: 111,
      });
      
      // test negative price
      await expect(
        this.pythOracle.getUnderlyingPrice(addr1111)
      ).to.be.revertedWith("SafeCast: value must be positive");

      feed.price = BigNumber.from(0);
      await this.underlyingPythOracle.updatePriceFeedsHarness([feed]);
      await expect(
        this.pythOracle.getUnderlyingPrice(addr1111)
      ).to.be.revertedWith("Pyth oracle price must be positive");
    })

    it('price should be 18 decimals', async function () {
      let vToken = await makeVToken(this.admin, { name: "vETH", symbol: "vETH" }, { name: "Ethereum", symbol: "ETH" });

      await this.pythOracle.setTokenConfig({
        vToken: vToken.address,
        pythId: getBytes32String(1),
        maxStalePeriod: 111,
      });

      let price = await this.pythOracle.getUnderlyingPrice(vToken.address);
      // 10000000 * 10**-6 * 10**18 * 10**0 = 1e19
      expect(price).to.equal(BigNumber.from(10).pow(19))

      vToken = await makeVToken(this.admin, { name: "vBTC", symbol: "vBTC" }, { name: "Bitcoin", symbol: "BTC", decimals: 8 });

      // test another token
      await this.pythOracle.setTokenConfig({
        vToken: vToken.address,
        pythId: getBytes32String(2),
        maxStalePeriod: 111,
      });

      price = await this.pythOracle.getUnderlyingPrice(vToken.address);
      // 1 * 10**2 * 10**18 * 10**10 = 1e30
      expect(price).to.equal(BigNumber.from(10).pow(30))
    })
  });

  describe('validation', function () {
    it('validate price', async function () {
      const vToken = await makeVToken(this.admin, { name: "vETH", symbol: "vETH" }, { name: "Ethereum", symbol: "ETH" });

      const token0 = getSimpleAddress(3);
      const validationConfig = {
        vToken: vToken.address,
        upperBoundRatio: EXP_SCALE.mul(12).div(10),
        lowerBoundRatio: EXP_SCALE.mul(8).div(10),
      }

      // set price
      await this.pythOracle.setTokenConfig({
        vToken: vToken.address,
        pythId: getBytes32String(3),
        maxStalePeriod: 111,
      });
      const feed = {
        id: getBytes32String(3),
        productId: getBytes32String(1),
        price: BigNumber.from(10).pow(6),
        conf: 10,
        expo: BigNumber.from(-6),
        status: 0,
        maxNumPublishers: 0,
        numPublishers: 0,
        emaPrice: 0,
        emaConf: 0,
        publishTime: await getTime(),
        prevPrice: 0,
        prevConf: 0,
        prevPublishTime: 0,
      };
      const underlyingPythAddress = await this.pythOracle.underlyingPythOracle();
      const UnderlyingPythFactory = await ethers.getContractFactory('MockPyth');
      const underlyingPyth = UnderlyingPythFactory.attach(underlyingPythAddress);
      const underlyingPythOracle = <MockPyth>underlyingPyth;
      await underlyingPythOracle.updatePriceFeedsHarness([feed]);

      // sanity check
      await expect(
        this.pythOracle.validatePrice(vToken.address, 100)
      ).to.be.revertedWith("validation config not exist");

      await this.pythOracle.setValidateConfigs([validationConfig]);
      
      // no need to test this, Pyth price must be positive
      // await expect(
      //   this.pythOracle.validatePrice(token0, 100)
      // ).to.be.revertedWith("anchor price is not valid");
        
      let validateResult = await this.pythOracle.validatePrice(vToken.address, EXP_SCALE)
      expect(validateResult).to.equal(true);
      validateResult = await this.pythOracle.validatePrice(vToken.address, EXP_SCALE.mul(100).div(79))
      expect(validateResult).to.equal(false);
      validateResult = await this.pythOracle.validatePrice(vToken.address, EXP_SCALE.mul(100).div(121))
      expect(validateResult).to.equal(false);
    })
  })
});
