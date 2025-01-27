// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "../FinancialManager.sol";

contract MockAttacker {
    FinancialManager public target;
    
    constructor(address payable _target) {
        target = FinancialManager(_target);
    }
    
    receive() external payable {
        if(address(target).balance >= 1 ether) {
            target.withdraw(1 ether);
        }
    }
    
    function attack() external payable {
        require(msg.value == 1 ether, "Need 1 ether");
        target.withdraw(1 ether);
    }
}