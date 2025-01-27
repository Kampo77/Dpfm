const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("FinancialManager", function () {
  let FinancialManager;
  let contract;
  let owner;
  let user1;
  let user2;

  beforeEach(async function () {
    [owner, user1, user2] = await ethers.getSigners();
    FinancialManager = await ethers.getContractFactory("FinancialManager");
    contract = await FinancialManager.deploy();
    await contract.deployed();
  });

  describe("Transaction Management", () => {
    it("should add a transaction", async () => {
      const tx = await contract.connect(user1).addTransaction(
        ethers.utils.parseEther("1.0"),
        "Food",
        "Lunch",
        false
      );
      
      await expect(tx)
        .to.emit(contract, "TransactionAdded")
        .withArgs(
          user1.address,
          1,
          ethers.utils.parseEther("1.0"),
          "Food",
          false
        );
    });

    it("should fail with zero amount", async () => {
      await expect(
        contract.connect(user1).addTransaction(
          0,
          "Food",
          "Lunch",
          false
        )
      ).to.be.revertedWith("Amount must be greater than 0");
    });
  });

  describe("Budget Management", () => {
    it("should set budget limit", async () => {
      const limit = ethers.utils.parseEther("5.0");
      
      await expect(contract.connect(user1).setBudget(limit, "Food"))
        .to.emit(contract, "BudgetUpdated")
        .withArgs(user1.address, limit, "Food");
    });

    it("should get user transactions", async () => {
      await contract.connect(user1).addTransaction(
        ethers.utils.parseEther("1.0"),
        "Food",
        "Lunch",
        false
      );

      const transactions = await contract.connect(user1).getUserTransactions();
      expect(transactions.length).to.equal(1);
    });

    it("should enforce budget limits", async () => {
      // Set budget
      await contract.connect(user1).setBudget(
        ethers.utils.parseEther("1.0"),
        "Food"
      );

      // Attempt to exceed budget
      await expect(
        contract.connect(user1).addTransaction(
          ethers.utils.parseEther("1.5"),
          "Food",
          "Expensive meal",
          false
        )
      ).to.be.revertedWith("Budget limit exceeded");
    });

    it("should track monthly spending", async () => {
      await contract.connect(user1).addTransaction(
        ethers.utils.parseEther("0.5"),
        "Food",
        "Lunch",
        false
      );

      const spending = await contract.getMonthlySpending(user1.address, "Food");
      expect(spending).to.equal(ethers.utils.parseEther("0.5"));
    });
  });

  describe("Input Validation", () => {
    it("should validate category length", async () => {
      await expect(
        contract.connect(user1).addTransaction(
          ethers.utils.parseEther("1.0"),
          "",
          "Lunch",
          false
        )
      ).to.be.revertedWith("Category required");
    });

    it("should validate description length", async () => {
      await expect(
        contract.connect(user1).addTransaction(
          ethers.utils.parseEther("1.0"),
          "Food",
          "L".repeat(201),
          false
        )
      ).to.be.revertedWith("Description too long");
    });
  });

  describe("Access Control", () => {
    it("should allow owner to pause contract", async () => {
      await expect(contract.connect(owner).pause())
        .to.emit(contract, "Paused")
        .withArgs(owner.address);
    });

    it("should prevent non-owner from pausing", async () => {
      await expect(contract.connect(user1).pause())
        .to.be.revertedWith("Ownable: caller is not the owner");
    });
  });

  describe("Gas Optimization", () => {
    it("should batch multiple transactions efficiently", async () => {
      const amounts = Array(5).fill(ethers.utils.parseEther("1.0"));
      const categories = Array(5).fill("Food");
      const descriptions = Array(5).fill("Lunch");
      const isIncomes = Array(5).fill(false);

      const tx = await contract.connect(user1).batchAddTransactions(
        amounts,
        categories,
        descriptions,
        isIncomes
      );
      
      const receipt = await tx.wait();
      expect(receipt.gasUsed).to.be.below(500000);
    });
  });

  describe("Edge Cases", () => {
    it("should handle maximum transaction amount", async () => {
      const maxAmount = ethers.constants.MaxUint256;
      await expect(contract.connect(user1).addTransaction(
        maxAmount,
        "Test",
        "Max amount test",
        true
      )).to.be.revertedWith("Amount too large");
    });

    it("should handle concurrent transactions", async () => {
      const promises = Array(5).fill().map(() => 
        contract.connect(user1).addTransaction(
          ethers.utils.parseEther("1.0"),
          "Food",
          "Lunch",
          false
        )
      );
      
      await Promise.all(promises);
      const transactions = await contract.getUserTransactions();
      expect(transactions.length).to.equal(5);
    });
  });

  describe("Withdrawal Tests", () => {
    it("should allow withdrawal of funds", async () => {
      // Add initial balance
      await contract.connect(user1).addTransaction(
        ethers.utils.parseEther("1.0"),
        "Income",
        "Salary",
        true,
        { value: ethers.utils.parseEther("1.0") }
      );

      const initialBalance = await ethers.provider.getBalance(user1.address);
      await contract.connect(user1).withdraw(ethers.utils.parseEther("0.5"));
      const finalBalance = await ethers.provider.getBalance(user1.address);

      expect(finalBalance.sub(initialBalance)).to.be
        .closeTo(ethers.utils.parseEther("0.5"), ethers.utils.parseEther("0.01"));
    });

    it("should prevent withdrawal exceeding balance", async () => {
      await expect(
        contract.connect(user1).withdraw(ethers.utils.parseEther("1.0"))
      ).to.be.revertedWith("Insufficient balance");
    });
  });

  describe("Transaction History", () => {
    it("should paginate transactions", async () => {
      // Add 10 transactions
      for(let i = 0; i < 10; i++) {
        await contract.connect(user1).addTransaction(
          ethers.utils.parseEther("1.0"),
          "Food",
          `Meal ${i}`,
          false
        );
      }

      const [transactions, total] = await contract.getTransactionsPaginated(0, 5);
      expect(transactions.length).to.equal(5);
      expect(total).to.equal(10);
    });

    it("should filter by category", async () => {
      await contract.connect(user1).addTransaction(
        ethers.utils.parseEther("1.0"),
        "Food",
        "Lunch",
        false
      );
      await contract.connect(user1).addTransaction(
        ethers.utils.parseEther("1.0"),
        "Transport",
        "Bus",
        false
      );

      const foodTransactions = await contract.getTransactionsByCategory("Food");
      expect(foodTransactions.length).to.equal(1);
    });
  });

  describe("Security Tests", () => {
    it("should prevent reentrancy attacks", async () => {
      const AttackerFactory = await ethers.getContractFactory("MockAttacker");
      const attacker = await AttackerFactory.deploy(contract.address);
      
      await expect(
        attacker.attack({ value: ethers.utils.parseEther("1.0") })
      ).to.be.revertedWith("ReentrancyGuard: reentrant call");
    });

    it("should handle overflow correctly", async () => {
      const maxUint = ethers.constants.MaxUint256;
      await expect(
        contract.addTransaction(maxUint, "Test", "Overflow test", true)
      ).to.be.revertedWith("Amount overflow");
    });
  });

  describe("Emergency Functions", () => {
    it("should allow emergency withdrawal by owner", async () => {
      await contract.connect(owner).emergencyWithdraw();
      expect(await ethers.provider.getBalance(contract.address)).to.equal(0);
    });

    it("should allow contract pause/unpause", async () => {
      await contract.connect(owner).pause();
      await expect(
        contract.addTransaction(100, "Test", "Should fail", false)
      ).to.be.revertedWith("Contract is paused");
      
      await contract.connect(owner).unpause();
      await expect(
        contract.addTransaction(100, "Test", "Should work", false)
      ).to.not.be.reverted;
    });
  });

  describe("Event Verification", () => {
    it("should emit all required events", async () => {
      const tx = await contract.connect(user1).addTransaction(
        ethers.utils.parseEther("1.0"),
        "Food",
        "Test event",
        false
      );
      
      await expect(tx)
        .to.emit(contract, "TransactionAdded")
        .withArgs(
          user1.address,
          1,
          ethers.utils.parseEther("1.0"),
          "Food",
          false
        );
    });
  });

  describe("Recovery Scenarios", () => {
    it("should recover from failed transactions", async () => {
      await contract.connect(user1).addTransaction(
        ethers.utils.parseEther("1.0"),
        "Food",
        "Test recovery",
        false
      );
      
      const failedTx = await contract.getFailedTransactions();
      expect(failedTx.length).to.equal(0);
    });
  });

  describe("Function Return Values", () => {
    // Transaction return values
    // Budget limits
    // State changes
  });

  describe("Event Emission", () => {
    // Transaction events
    // Budget update events
  });

  describe("Error Handling", () => {
    // Input validation
    // Access control
    // Edge cases
  });
});