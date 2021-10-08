import { ethers, waffle } from "hardhat";
const { provider } = waffle;
import chai from "chai";
import chaiAsPromised from "chai-as-promised";
import { RareRedirect__factory, RareRedirect } from "../typechain";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

chai.use(chaiAsPromised);
const { expect } = chai;

describe("RareRedirect", () => {
  let rareRedirect: RareRedirect;

  let owner: SignerWithAddress;
  let addr1: SignerWithAddress;
  let addr2: SignerWithAddress;
  let addrs: SignerWithAddress[];

  beforeEach(async () => {
    [owner, addr1, addr2, ...addrs] = await ethers.getSigners();

    const rareRedirectFactory = (await ethers.getContractFactory(
      "RareRedirect",
      owner
    )) as RareRedirect__factory;
    rareRedirect = await rareRedirectFactory.deploy();
    await rareRedirect.deployed();
    const initialUrl = await rareRedirect.getUrl();

    expect(initialUrl).to.eq("");
    expect(rareRedirect.address).to.properAddress;
  });

  describe("set url", async () => {
    beforeEach(async () => {
      await rareRedirect
        .connect(owner)
        .functions.setUrlPayable("https://twitter.com/nickbytes", {
          from: owner.address,
          value: ethers.utils.parseEther("1.0"),
        });
    });

    it("should set url with 1.0eth floor", async () => {
      let url = await rareRedirect.getUrl();
      expect(url).to.eq("https://twitter.com/nickbytes");
    });

    it("checks price at 1.0", async () => {
      const priceFloor = await rareRedirect.priceFloor();
      expect(priceFloor).to.eq(ethers.utils.parseEther("1.0"));
    });

    it("should revert if price is below floor", async () => {
      const failedBelowFloor = rareRedirect
        .connect(owner)
        .functions.setUrlPayable("https://twitter.com/VitalikButerin", {
          from: owner.address,
          value: ethers.utils.parseEther("0.5"),
        });

      await expect(failedBelowFloor).to.be.reverted;
    });

    it("should allow setUrl with over 1.0", async () => {
      await rareRedirect
        .connect(addr2)
        .functions.setUrlPayable("https://twitter.com/CryptoCobain", {
          from: addr2.address,
          value: ethers.utils.parseEther("2.5"),
        });

      await expect(await rareRedirect.getUrl()).to.eq(
        "https://twitter.com/CryptoCobain"
      );
      await expect(await rareRedirect.getPriceFloor()).to.eq(
        ethers.utils.parseEther("2.5")
      );
    });
  });

  describe("owner set url", async () => {
    it("should set url when owner", async () => {
      await rareRedirect.setUrlForOwner("https://uniswap.org/");
      let url = await rareRedirect.getUrl();
      expect(url).to.eq("https://uniswap.org/");
    });

    it("should revert when not owner", async () => {
      const failed = rareRedirect
        .connect(addr1)
        .setUrlForOwner("https://www.binance.com/");

      await expect(failed).to.be.reverted;
    });
  });

  describe("withdraw funds", async () => {
    beforeEach(async () => {
      await rareRedirect
        .connect(addr2)
        .functions.setUrlPayable("https://www.coincenter.org/", {
          from: addr2.address,
          value: ethers.utils.parseEther("4.20"),
        });
    });

    it("check that the contract has 4.20 ETH", async () => {
      const balance = await provider.getBalance(rareRedirect.address);
      await expect(balance).to.be.eq(ethers.utils.parseEther("4.20"));
    });

    it("withdraws funds to owner", async () => {
      await rareRedirect.connect(owner).functions.withdrawAll();
      const balance = await provider.getBalance(rareRedirect.address);
      await expect(balance).to.be.eq(ethers.utils.parseEther("0.0"));
    });

    // Probably unnecessary to test OpenZeppelin Ownable here
    it("withdraws attempts from non-owners reverts", async () => {
      const failedWithdraw = rareRedirect
        .connect(addr2)
        .functions.withdrawAll();
      await expect(failedWithdraw).to.be.revertedWith(
        "Ownable: caller is not the owner"
      );
    });
  });
});
