// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract FileStorage {
    struct FileData {
        uint256 id;
        string name;
        string hash;
        uint256 size;
        address owner;
        uint256 timestamp;
        bool isActive;
        uint256 price;
        string category;        // Added for financial categorization
        string description;     // Added for transaction details
        uint256 budgetLimit;   // Added for budget tracking
    }

    mapping(uint256 => FileData) public files;
    uint256 public fileCount;
    mapping(address => uint256) public userBalances;
    mapping(address => uint256[]) private userFiles;
    mapping(address => uint256) public userBudgets;    // Added for budget tracking

    event FileUploaded(
        address indexed owner,
        uint256 indexed fileId,
        string name,
        string category,
        uint256 amount,
        uint256 timestamp
    );
    
    event BudgetUpdated(
        address indexed user,
        uint256 newBudget,
        uint256 timestamp
    );

    function addFinancialRecord(
        string memory _name,
        string memory _hash,
        uint256 _amount,
        string memory _category,
        string memory _description
    ) public returns (FileData memory) {
        fileCount++;
        
        FileData memory newFile = FileData({
            id: fileCount,
            name: _name,
            hash: _hash,
            size: _amount,
            owner: msg.sender,
            timestamp: block.timestamp,
            isActive: true,
            price: 0,
            category: _category,
            description: _description,
            budgetLimit: 0
        });

        files[fileCount] = newFile;
        userFiles[msg.sender].push(fileCount);
        
        emit FileUploaded(
            msg.sender,
            fileCount,
            _name,
            _category,
            _amount,
            block.timestamp
        );
        
        return newFile;
    }

    function setBudget(uint256 _amount) public {
        require(_amount > 0, "Budget must be positive");
        userBudgets[msg.sender] = _amount;
        emit BudgetUpdated(msg.sender, _amount, block.timestamp);
    }

    function getUserRecords(address _user) public view returns (FileData[] memory) {
        uint256[] memory userFileIds = userFiles[_user];
        FileData[] memory result = new FileData[](userFileIds.length);
        
        for (uint256 i = 0; i < userFileIds.length; i++) {
            result[i] = files[userFileIds[i]];
        }
        
        return result;
    }

    function withdrawBalance() public {
        uint256 balance = userBalances[msg.sender];
        require(balance > 0, "No balance to withdraw");
        
        userBalances[msg.sender] = 0;
        payable(msg.sender).transfer(balance);
    }
}