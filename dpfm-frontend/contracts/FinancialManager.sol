// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract FinancialManager is ReentrancyGuard, Pausable, Ownable {
    struct Transaction {
        uint256 id;
        address user;
        uint256 amount;
        string category;
        string description;
        uint256 timestamp;
        bool isIncome;
    }

    mapping(address => Transaction[]) private userTransactions;
    mapping(address => mapping(string => uint256)) private userBudgets;
    
    event TransactionAdded(
        address indexed user,
        uint256 indexed id,
        uint256 amount,
        string category,
        bool isIncome
    );
    
    event BudgetUpdated(
        address indexed user,
        uint256 newLimit,
        string category
    );

    function addTransaction(
        uint256 _amount,
        string memory _category,
        string memory _description,
        bool _isIncome
    ) external nonReentrant returns (Transaction memory) {
        require(_amount > 0, "Amount must be greater than 0");
        require(bytes(_category).length > 0, "Category required");
        require(bytes(_description).length <= 200, "Description too long");

        Transaction memory newTx = Transaction({
            id: userTransactions[msg.sender].length + 1,
            user: msg.sender,
            amount: _amount,
            category: _category,
            description: _description,
            timestamp: block.timestamp,
            isIncome: _isIncome
        });

        userTransactions[msg.sender].push(newTx);
        emit TransactionAdded(msg.sender, newTx.id, _amount, _category, _isIncome);
        return newTx;
    }

    function getUserTransactions() external view returns (Transaction[] memory) {
        return userTransactions[msg.sender];
    }

    function setBudget(uint256 _limit, string memory _category) external {
        require(_limit > 0, "Budget limit must be greater than 0");
        userBudgets[msg.sender][_category] = _limit;
        emit BudgetUpdated(msg.sender, _limit, _category);
    }

    function getBudget(string memory _category) external view returns (uint256) {
        return userBudgets[msg.sender][_category];
    }
}