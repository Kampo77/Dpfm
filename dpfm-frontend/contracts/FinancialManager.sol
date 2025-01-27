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
    mapping(address => mapping(string => uint256)) private monthlySpending;
    mapping(address => Transaction[]) private failedTransactions;
    
    uint256 private constant MAX_BUDGET = 1000000 ether;
    uint256 private constant MAX_AMOUNT = 100000 ether;
    
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

    receive() external payable {}

    function _addTransaction(
        uint256 _amount,
        string memory _category,
        string memory _description,
        bool _isIncome
    ) internal returns (Transaction memory) {
        require(_amount > 0, "Amount must be greater than 0");
        require(_amount <= MAX_AMOUNT, "Amount too large");
        require(bytes(_category).length > 0, "Category required");
        require(bytes(_description).length <= 200, "Description too long");

        if (!_isIncome) {
            require(userBudgets[msg.sender][_category] >= _amount, "Budget limit exceeded");
            monthlySpending[msg.sender][_category] += _amount;
        }

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

    function addTransaction(
        uint256 _amount,
        string memory _category,
        string memory _description,
        bool _isIncome
    ) external payable nonReentrant whenNotPaused returns (Transaction memory) {
        return _addTransaction(_amount, _category, _description, _isIncome);
    }

    function getUserTransactions() external view returns (Transaction[] memory) {
        return userTransactions[msg.sender];
    }

    function setBudget(uint256 _limit, string memory _category) external {
        require(_limit > 0, "Budget limit must be greater than 0");
        require(_limit <= MAX_BUDGET, "Budget limit too high");
        userBudgets[msg.sender][_category] = _limit;
        emit BudgetUpdated(msg.sender, _limit, _category);
    }

    function getBudget(string memory _category) external view returns (uint256) {
        return userBudgets[msg.sender][_category];
    }

    function getMonthlySpending(address _user, string memory _category) external view returns (uint256) {
        return monthlySpending[_user][_category];
    }

    function getTransactionsPaginated(uint256 _offset, uint256 _limit) 
        external 
        view 
        returns (Transaction[] memory, uint256) 
    {
        Transaction[] storage userTxs = userTransactions[msg.sender];
        uint256 end = _offset + _limit > userTxs.length ? userTxs.length : _offset + _limit;
        uint256 length = end - _offset;
        
        Transaction[] memory result = new Transaction[](length);
        for(uint256 i = _offset; i < end; i++) {
            result[i - _offset] = userTxs[i];
        }
        
        return (result, userTxs.length);
    }

    function getFailedTransactions() external view returns (Transaction[] memory) {
        return failedTransactions[msg.sender];
    }

    function getTransactionsByCategory(string memory _category) external view returns (Transaction[] memory) {
        Transaction[] storage allTxs = userTransactions[msg.sender];
        uint256 count;
        
        for(uint256 i = 0; i < allTxs.length; i++) {
            if(keccak256(bytes(allTxs[i].category)) == keccak256(bytes(_category))) {
                count++;
            }
        }
        
        Transaction[] memory result = new Transaction[](count);
        uint256 index;
        
        for(uint256 i = 0; i < allTxs.length; i++) {
            if(keccak256(bytes(allTxs[i].category)) == keccak256(bytes(_category))) {
                result[index] = allTxs[i];
                index++;
            }
        }
        
        return result;
    }

    function withdraw(uint256 _amount) external nonReentrant whenNotPaused {
        require(_amount > 0, "Amount must be greater than 0");
        require(address(this).balance >= _amount, "Insufficient balance");
        payable(msg.sender).transfer(_amount);
    }

    function emergencyWithdraw() external onlyOwner {
        payable(owner()).transfer(address(this).balance);
    }

    function pause() external onlyOwner {
        _pause();
    }

    function unpause() external onlyOwner {
        _unpause();
    }

    function batchAddTransactions(
        uint256[] calldata amounts,
        string[] calldata categories,
        string[] calldata descriptions,
        bool[] calldata isIncomes
    ) external nonReentrant whenNotPaused {
        require(
            amounts.length == categories.length &&
            categories.length == descriptions.length &&
            descriptions.length == isIncomes.length,
            "Arrays length mismatch"
        );
        
        for(uint256 i = 0; i < amounts.length; i++) {
            _addTransaction(amounts[i], categories[i], descriptions[i], isIncomes[i]);
        }
    }
}