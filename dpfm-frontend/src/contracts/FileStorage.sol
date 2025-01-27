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
    }

    mapping(uint256 => FileData) public files;
    uint256 public fileCount;
    mapping(address => uint256) public userBalances;

    // Events requirement
    event FileUploaded(
        address indexed owner,
        uint256 indexed fileId,
        string name,
        uint256 size,
        uint256 timestamp
    );
    
    event FileAccessGranted(
        uint256 indexed fileId,
        address indexed grantedTo,
        uint256 timestamp
    );

    // State-changing function
    function addFile(string memory _name, string memory _hash, uint256 _size) public returns (FileData memory) {
        fileCount++;
        
        FileData memory newFile = FileData({
            id: fileCount,
            name: _name,
            hash: _hash,
            size: _size,
            owner: msg.sender,
            timestamp: block.timestamp,
            isActive: true,
            price: 0
        });

        files[fileCount] = newFile;
        emit FileUploaded(msg.sender, fileCount, _name, _size, block.timestamp);
        
        return newFile;
    }

    // Payable function
    function purchaseAccess(uint256 _fileId) public payable {
        require(_fileId > 0 && _fileId <= fileCount, "Invalid file ID");
        require(msg.value >= files[_fileId].price, "Insufficient payment");
        
        userBalances[files[_fileId].owner] += msg.value;
        emit FileAccessGranted(_fileId, msg.sender, block.timestamp);
    }

    // Read-only function (view)
    function getFile(uint256 _id) public view returns (FileData memory) {
        require(_id > 0 && _id <= fileCount, "Invalid file ID");
        return files[_id];
    }

    // Additional helper function
    function withdrawBalance() public {
        uint256 balance = userBalances[msg.sender];
        require(balance > 0, "No balance to withdraw");
        
        userBalances[msg.sender] = 0;
        payable(msg.sender).transfer(balance);
    }
}