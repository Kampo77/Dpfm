// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract FinancialManager {
    struct Transaction {
        uint256 id;
        address user;
        uint256 amount;
        string category;
        string description;
        uint256 timestamp;
        bool isIncome;
    }

    struct Budget {
        uint256 limit;
        mapping(string => uint256) categoryLimits;
        uint256 totalSpent;
    }

    mapping(address => Transaction[]) private userTransactions;
    mapping(address => Budget) private userBudgets;
    uint256 private transactionCount;
    address private owner;

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
    ) public returns (Transaction memory) {
        require(_amount > 0, "Amount must be positive");
        
        transactionCount++;
        Transaction memory newTx = Transaction({
            id: transactionCount,
            user: msg.sender,
            amount: _amount,
            category: _category,
            description: _description,
            timestamp: block.timestamp,
            isIncome: _isIncome
        });

        userTransactions[msg.sender].push(newTx);
        
        if (!_isIncome) {
            require(
                userBudgets[msg.sender].totalSpent + _amount <= userBudgets[msg.sender].limit,
                "Exceeds budget limit"
            );
            userBudgets[msg.sender].totalSpent += _amount;
        }

        emit TransactionAdded(msg.sender, transactionCount, _amount, _category, _isIncome);
        return newTx;
    }

    // Add new payable function
    function addPaidTransaction(
        uint256 _amount,
        string memory _category,
        string memory _description,
        bool _isIncome
    ) public payable returns (Transaction memory) {
        require(msg.value >= 0.01 ether, "Insufficient fee");
        
        Transaction memory newTx = addTransaction(_amount, _category, _description, _isIncome);
        
        // Transfer fee to contract
        payable(address(this)).transfer(msg.value);
        
        return newTx;
    }

    // Add withdrawal function
    function withdrawFees() public {
        require(msg.sender == owner, "Only owner can withdraw fees");
        payable(owner).transfer(address(this).balance);
    }

    function setBudget(uint256 _limit, string memory _category) public {
        require(_limit > 0, "Budget must be positive");
        userBudgets[msg.sender].limit = _limit;
        userBudgets[msg.sender].categoryLimits[_category] = _limit;
        emit BudgetUpdated(msg.sender, _limit, _category);
    }

    function getUserTransactions() public view returns (Transaction[] memory) {
        return userTransactions[msg.sender];
    }

    function getBudgetLimit() public view returns (uint256) {
        return userBudgets[msg.sender].limit;
    }
}