const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("FinancialManager Edge Cases", () => {
  let financialManager;
  let owner;
  let user1;
  
  beforeEach(async () => {
    const FinancialManager = await ethers.getContractFactory("FinancialManager");
    [owner, user1] = await ethers.getSigners();
    financialManager = await FinancialManager.deploy();
    await financialManager.deployed();
  });

  describe("Number Limits", () => {
    it("should handle maximum uint256 budget", async () => {
      const maxUint = ethers.constants.MaxUint256;
      await expect(
        financialManager.setBudget(maxUint, "Test")
      ).to.be.revertedWith("Budget limit too high");
    });

    it("should handle minimum transaction amount", async () => {
      await expect(
        financialManager.addTransaction(1, "Test", "Min amount", false)
      ).to.not.be.reverted;
    });
  });

  describe("String Limits", () => {
    it("should reject empty category", async () => {
      await expect(
        financialManager.addTransaction(100, "", "Test", false)
      ).to.be.revertedWith("Category required");
    });

    it("should reject long description", async () => {
      const longDesc = "a".repeat(201);
      await expect(
        financialManager.addTransaction(100, "Test", longDesc, false)
      ).to.be.revertedWith("Description too long");
    });
  });

  describe("Gas Optimization", () => {
    it("should optimize multiple transactions", async () => {
      const tx = await financialManager.addTransaction(100, "Test", "Gas test", false);
      const receipt = await tx.wait();
      expect(receipt.gasUsed).to.be.below(200000);
    });
  });

  describe("Error Conditions", () => {
    it("should handle concurrent transactions", async () => {
      const promises = Array(5).fill().map(() => 
        financialManager.addTransaction(100, "Test", "Concurrent", false)
      );
      await Promise.all(promises);
    });

    it("should maintain transaction order", async () => {
      await financialManager.addTransaction(100, "Test", "First", false);
      await financialManager.addTransaction(200, "Test", "Second", false);
      
      const txs = await financialManager.getUserTransactions();
      expect(txs[0].amount).to.equal(100);
      expect(txs[1].amount).to.equal(200);
    });
  });
});