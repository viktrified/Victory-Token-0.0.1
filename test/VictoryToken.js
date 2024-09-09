const { expect } = require("chai");
const hre = require("hardhat");

describe("VictoryToken contract", function () {
  // global vars
  let Token;
  let victoryToken;
  let owner;
  let addr1;
  let addr2;
  let tokenCap = 100000000;
  let tokenBlockReward = 50;

  beforeEach(async function () {
    // Get the ContractFactory and Signers here.
    Token = await ethers.getContractFactory("VictoryToken");
    [owner, addr1, addr2] = await hre.ethers.getSigners();

    victoryToken = await Token.deploy(tokenCap, tokenBlockReward);
  });
  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await victoryToken.owner()).to.equal(owner.address);
    });

    it("Should assign the total supply of tokens to the owner", async function () {
      const ownerBalance = await victoryToken.balanceOf(owner.address);
      expect(await victoryToken.totalSupply()).to.equal(ownerBalance);
    });

    it("Should set the max capped supply to the argument provided during deployment", async function () {
      const cap = await victoryToken.cap();
      expect(Number(hre.ethers.formatEther(cap))).to.equal(tokenCap);
    });

    it("Should set the blockReward to the argument provided during deployment", async function () {
      const blockReward = await victoryToken.blockReward();
      expect(Number(hre.ethers.formatEther(blockReward))).to.equal(
        tokenBlockReward
      );
    });
  });
  describe("Transactions", function () {
    it("Should transfer tokens between accounts", async function () {
      // Transfer 50 tokens from owner to addr1
      await victoryToken.transfer(addr1.address, 50);
      const addr1Balance = await victoryToken.balanceOf(addr1.address);
      expect(addr1Balance).to.equal(50);

      // Transfer 50 tokens from addr1 to addr2
      // We use .connect(signer) to send a transaction from another account
      await victoryToken.connect(addr1).transfer(addr2.address, 50);
      const addr2Balance = await victoryToken.balanceOf(addr2.address);
      expect(addr2Balance).to.equal(50);
    });

    it("Should fail if sender doesn't have enough tokens", async function () {
      const initialOwnerBalance = await victoryToken.balanceOf(owner.address);
      
      // Try to send 1 token from addr1 (which has 0 tokens) to owner.
      await expect(
        victoryToken.connect(addr1).transfer(owner.address, 1)
      ).to.be.revertedWithCustomError(victoryToken, "ERC20InsufficientBalance");
      
      // Ensure the owner's balance hasn't changed.
      expect(await victoryToken.balanceOf(owner.address)).to.equal(initialOwnerBalance);
    });
    
    it("Should update balances after transfers", async function () {
      const initialOwnerBalance = await victoryToken.balanceOf(owner.address);

      // Transfer 100 tokens from owner to addr1.
      await victoryToken.transfer(addr1.address, 100);

      // Transfer another 50 tokens from owner to addr2.
      await victoryToken.transfer(addr2.address, 50);

      // Check balances.
      const finalOwnerBalance = await victoryToken.balanceOf(owner.address);
      expect(finalOwnerBalance).to.equal(initialOwnerBalance-BigInt(150));

      const addr1Balance = await victoryToken.balanceOf(addr1.address);
      expect(addr1Balance).to.equal(100);

      const addr2Balance = await victoryToken.balanceOf(addr2.address);
      expect(addr2Balance).to.equal(50);
    });
  });
});