const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("FinancialManager", function () {
    let FinancialManager, financialManager, owner, user1, user2;

    beforeEach(async function () {
        [owner, user1, user2] = await ethers.getSigners();
        FinancialManager = await ethers.getContractFactory("FinancialManager");
        financialManager = await FinancialManager.deploy();
        await financialManager.deployed();
    });

    describe("Transaction Management", function () {
        it("Should add a transaction successfully", async function () {
            const tx = await financialManager.connect(user1).addTransaction(100, "Food", "Lunch", false);
            const receipt = await tx.wait();
            expect(receipt.events.length).to.be.greaterThan(0);

            const transactions = await financialManager.connect(user1).getUserTransactions();
            expect(transactions.length).to.equal(1);
            expect(transactions[0].amount).to.equal(100);
        });

        it("Should emit a TransactionAdded event", async function () {
            await expect(financialManager.connect(user1).addTransaction(100, "Food", "Lunch", false))
                .to.emit(financialManager, "TransactionAdded")
                .withArgs(user1.address, 1, 100, "Food", false);
        });

        it("Should fail if amount is zero or negative", async function () {
            await expect(
                financialManager.connect(user1).addTransaction(0, "Food", "Lunch", false)
            ).to.be.revertedWith("Amount must be positive");
        });
    });

    describe("Paid Transactions", function () {
        it("Should require at least 0.01 ether fee", async function () {
            await expect(
                financialManager.connect(user1).addPaidTransaction(100, "Rent", "Monthly payment", false, { value: ethers.utils.parseEther("0.005") })
            ).to.be.revertedWith("Insufficient fee");
        });

        it("Should add a paid transaction successfully", async function () {
            await financialManager.connect(user1).addPaidTransaction(100, "Rent", "Monthly payment", false, { value: ethers.utils.parseEther("0.01") });
            const transactions = await financialManager.connect(user1).getUserTransactions();
            expect(transactions.length).to.equal(1);
            expect(transactions[0].amount).to.equal(100);
        });
    });

    describe("Budget Management", function () {
        it("Should set budget successfully", async function () {
            await financialManager.connect(user1).setBudget(500, "Groceries");
            const budgetLimit = await financialManager.connect(user1).getBudgetLimit();
            expect(budgetLimit).to.equal(500);
        });

        it("Should emit a BudgetUpdated event", async function () {
            await expect(financialManager.connect(user1).setBudget(500, "Groceries"))
                .to.emit(financialManager, "BudgetUpdated")
                .withArgs(user1.address, 500, "Groceries");
        });

        it("Should fail if budget is zero or negative", async function () {
            await expect(
                financialManager.connect(user1).setBudget(0, "Groceries")
            ).to.be.revertedWith("Budget must be positive");
        });
    });

    describe("Budget Limit Enforcement", function () {
        it("Should prevent spending beyond budget", async function () {
            await financialManager.connect(user1).setBudget(50, "Food");
            await expect(
                financialManager.connect(user1).addTransaction(100, "Food", "Dinner", false)
            ).to.be.revertedWith("Exceeds budget limit");
        });
    });

    describe("Fee Withdrawal", function () {
        it("Should allow only owner to withdraw fees", async function () {
            await expect(
                financialManager.connect(user1).withdrawFees()
            ).to.be.revertedWith("Only owner can withdraw fees");
        });
    });
});
