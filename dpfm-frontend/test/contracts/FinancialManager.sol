// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract FinancialManager is Ownable, AccessControl, ReentrancyGuard {
    bytes32 public constant TRANSACTOR_ROLE = keccak256("TRANSACTOR_ROLE");
    
    struct Transaction {
        address user;
        uint256 amount;
        string category;
        string description;
        bool isExpense;
        uint256 timestamp;
    }

    mapping(address => Transaction[]) private userTransactions;
    mapping(address => uint256) private userBudgets;

    event TransactionAdded(
        address indexed user,
        uint256 amount,
        string category,
        bool isExpense
    );
    
    event BudgetUpdated(address indexed user, uint256 newLimit);

    constructor() {
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _setupRole(TRANSACTOR_ROLE, msg.sender);
    }

    modifier validAmount(uint256 amount) {
        require(amount > 0, "Amount must be greater than 0");
        _;
    }

    function addTransaction(
        uint256 amount,
        string memory category,
        string memory description,
        bool isExpense
    ) public nonReentrant onlyRole(TRANSACTOR_ROLE) validAmount(amount) {
        require(bytes(category).length > 0, "Category cannot be empty");
        
        Transaction memory newTransaction = Transaction({
            user: msg.sender,
            amount: amount,
            category: category,
            description: description,
            isExpense: isExpense,
            timestamp: block.timestamp
        });

        userTransactions[msg.sender].push(newTransaction);
        emit TransactionAdded(msg.sender, amount, category, isExpense);
    }

    function setBudget(uint256 amount) external validAmount(amount) {
        userBudgets[msg.sender] = amount;
        emit BudgetUpdated(msg.sender, amount);
    }

    function getUserTransactions() external view returns (Transaction[] memory) {
        return userTransactions[msg.sender];
    }

    function getBudget() external view returns (uint256) {
        return userBudgets[msg.sender];
    }

    function grantTransactorRole(address account) external onlyOwner {
        grantRole(TRANSACTOR_ROLE, account);
    }

    function revokeTransactorRole(address account) external onlyOwner {
        revokeRole(TRANSACTOR_ROLE, account);
    }

    function hasTransactorRole(address account) external view returns (bool) {
        return hasRole(TRANSACTOR_ROLE, account);
    }
}