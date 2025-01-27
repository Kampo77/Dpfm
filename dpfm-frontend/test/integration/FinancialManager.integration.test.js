const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("FinancialManager Integration Tests", function () {
  let contract;
  let owner;
  let users;

  before(async function () {
    [owner, ...users] = await ethers.getSigners();
    const FinancialManager = await ethers.getContractFactory("FinancialManager");
    contract = await FinancialManager.deploy();
    await contract.deployed();
  });

  describe("Multi-user Scenarios", () => {
    it("should handle multiple users concurrently", async () => {
      const userPromises = users.slice(0, 3).map(user => 
        contract.connect(user).addTransaction(
          ethers.utils.parseEther("1.0"),
          "Food",
          "Test concurrent",
          false
        )
      );
      
      await Promise.all(userPromises);
      
      for (const user of users.slice(0, 3)) {
        const txs = await contract.getUserTransactions(user.address);
        expect(txs.length).to.equal(1);
      }
    });

    it("should maintain separate budgets per user", async () => {
      await Promise.all(
        users.slice(0, 2).map(user =>
          contract.connect(user).setBudget(
            ethers.utils.parseEther("1.0"),
            "Food"
          )
        )
      );

      for (const user of users.slice(0, 2)) {
        const budget = await contract.getBudget(user.address, "Food");
        expect(budget).to.equal(ethers.utils.parseEther("1.0"));
      }
    });
  });

  describe("System Stress Tests", () => {
    it("should handle large transaction volumes", async () => {
      const user = users[0];
      const txCount = 50;
      
      for (let i = 0; i < txCount; i++) {
        await contract.connect(user).addTransaction(
          ethers.utils.parseEther("0.1"),
          "Test",
          `Stress test ${i}`,
          false
        );
      }

      const txs = await contract.getUserTransactions(user.address);
      expect(txs.length).to.equal(txCount);
    });
  });
});