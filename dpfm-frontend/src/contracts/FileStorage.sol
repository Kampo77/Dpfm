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
    }

    mapping(uint256 => FileData) public files;
    uint256 public fileCount;

    // Two required events
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

    function addFile(string memory _name, string memory _hash, uint256 _size) public returns (FileData memory) {
        fileCount++;
        
        FileData memory newFile = FileData({
            id: fileCount,
            name: _name,
            hash: _hash,
            size: _size,
            owner: msg.sender,
            timestamp: block.timestamp,
            isActive: true
        });

        files[fileCount] = newFile;
        
        // Emit first event
        emit FileUploaded(
            msg.sender,
            fileCount,
            _name,
            _size,
            block.timestamp
        );
        
        return newFile;
    }

    function grantAccess(uint256 _fileId, address _user) public {
        require(_fileId > 0 && _fileId <= fileCount, "Invalid file ID");
        require(files[_fileId].owner == msg.sender, "Not the file owner");
        require(_user != address(0), "Invalid address");
        
        // Emit second event
        emit FileAccessGranted(
            _fileId,
            _user,
            block.timestamp
        );
    }

    function getFile(uint256 _id) public view returns (FileData memory) {
        require(_id > 0 && _id <= fileCount, "Invalid file ID");
        return files[_id];
    }
}