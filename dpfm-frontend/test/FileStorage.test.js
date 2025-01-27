const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("FinancialManager", function () {
  let FinancialManager;
  let financialManager;
  let owner;
  let addr1;
  let addr2;

  beforeEach(async function () {
    // Deploy a new FinancialManager contract for each test
    FinancialManager = await ethers.getContractFactory("FinancialManager");
    [owner, addr1, addr2] = await ethers.getSigners();
    financialManager = await FinancialManager.deploy();
    await financialManager.deployed();
  });

  describe("Transactions", function () {
    it("Should add a new transaction", async function () {
      const amount = ethers.utils.parseEther("1.0");
      const category = "Food";
      const description = "Lunch";
      const isIncome = false;

      await expect(financialManager.connect(addr1).addTransaction(
        amount,
        category,
        description,
        isIncome
      ))
        .to.emit(financialManager, "TransactionAdded")
        .withArgs(addr1.address, 1, amount, category, isIncome);

      const transactions = await financialManager.getUserTransactions();
      expect(transactions.length).to.equal(1);
      expect(transactions[0].amount).to.equal(amount);
      expect(transactions[0].category).to.equal(category);
    });

    it("Should fail with zero amount", async function () {
      const amount = 0;
      const category = "Food";
      const description = "Lunch";
      const isIncome = false;

      await expect(
        financialManager.connect(addr1).addTransaction(
          amount,
          category,
          description,
          isIncome
        )
      ).to.be.revertedWith("Amount must be greater than 0");
    });
  });

  describe("Budget Management", function () {
    it("Should set budget limit", async function () {
      const limit = ethers.utils.parseEther("5.0");
      const category = "Food";

      await expect(financialManager.connect(addr1).setBudget(limit, category))
        .to.emit(financialManager, "BudgetUpdated")
        .withArgs(addr1.address, limit, category);

      const budget = await financialManager.getBudget(category);
      expect(budget).to.equal(limit);
    });

    it("Should fail with invalid budget limit", async function () {
      const limit = 0;
      const category = "Food";

      await expect(
        financialManager.connect(addr1).setBudget(limit, category)
      ).to.be.revertedWith("Budget limit must be greater than 0");
    });
  });

  describe("Events", function () {
    it("Should emit TransactionAdded event", async function () {
      const amount = ethers.utils.parseEther("1.0");
      const category = "Food";
      const description = "Lunch";
      const isIncome = false;

      await expect(
        financialManager.connect(addr1).addTransaction(
          amount,
          category,
          description,
          isIncome
        )
      )
        .to.emit(financialManager, "TransactionAdded")
        .withArgs(addr1.address, 1, amount, category, isIncome);
    });
  });
});