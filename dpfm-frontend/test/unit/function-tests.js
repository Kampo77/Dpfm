const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("FinancialManager Function Tests", () => {
  let financialManager;
  let owner;
  let user1;

  beforeEach(async () => {
    const FinancialManager = await ethers.getContractFactory("FinancialManager");
    [owner, user1] = await ethers.getSigners();
    financialManager = await FinancialManager.deploy();
    await financialManager.deployed();
  });

  describe("Return Values", () => {
    it("should return correct transaction data", async () => {
      const tx = await financialManager.addTransaction(100, "Test", "Return test", false);
      const receipt = await tx.wait();
      const event = receipt.events?.find(e => e.event === 'TransactionAdded');
      expect(event.args.amount).to.equal(100);
    });
  });

  describe("State Changes", () => {
    it("should update budget correctly", async () => {
      await financialManager.setBudget(1000, "Food");
      const budget = await financialManager.getBudget("Food");
      expect(budget).to.equal(1000);
    });
  });

  describe("Access Control", () => {
    it("should restrict admin functions", async () => {
      await expect(
        financialManager.connect(user1).pause()
      ).to.be.revertedWith("Ownable: caller is not the owner");
    });
  });
});