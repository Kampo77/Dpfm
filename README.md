# Decentralized Financial Manager

## Overview
A comprehensive financial management dApp built on Ethereum, enabling users to track expenses, manage budgets, and handle transactions securely.

## Features
- Transaction management with role-based access
- Real-time event monitoring
- Budget tracking and limits
- Multi-user support with role management

## Technical Stack
- Smart Contracts: Solidity
- Frontend: React
- Web3 Integration: ethers.js
- UI Framework: Material-UI

## Setup Instructions

### Prerequisites
- Node.js v14+
- MetaMask browser extension
- Sepolia testnet ETH

### Installation
```bash
# Install dependencies
npm install

# Create environment file
copy .env.example .env

# Start development server
npm start
```

### Smart Contract Deployment
```bash
# Deploy to Sepolia testnet
npx hardhat run scripts/deploy.js --network sepolia
```

## Security Features
1. **Reentrancy Protection**
   - NonReentrant modifier
   - Action cooldown
2. **Access Control**
   - Role-based permissions
   - Granular function access
3. **Input Validation**
   - Type checking
   - Range validation
4. **Transaction Security**
   - Gas estimation
   - Balance verification

## Error Handling
Common errors and solutions:
1. "Insufficient funds"
   - Check wallet balance
   - Verify gas settings
2. "Transaction failed"
   - Check transaction parameters
   - Verify network connection
3. "Unauthorized"
   - Check user permissions
   - Verify wallet connection

## Testing
- Unit tests
- Integration tests
- Security tests

## Technical Architecture
- **Smart Contract**: Solidity v0.8.x
- **Frontend**: React 18
- **Web3**: ethers.js v5
- **Testing**: Hardhat, Chai
- **UI**: Material-UI v5

## API Reference

### Smart Contract Functions

#### addTransaction
```solidity
function addTransaction(uint256 amount, string memory category) external
```
- **Parameters**:
  - amount: Transaction amount in wei
  - category: Transaction category
- **Requirements**:
  - Caller must have TRANSACTOR_ROLE
  - Amount must be > 0
  - Category must not be empty

#### updateBudget
```solidity
function updateBudget(uint256 newLimit) external
```
- **Parameters**:
  - newLimit: New budget limit in wei
- **Requirements**:
  - Caller must be contract owner
  - newLimit must be > 0

## Deployment Guide
1. Configure environment
2. Deploy contract
3. Verify on Etherscan
4. Setup roles

## Architecture
- Smart Contracts: Solidity
- Frontend: React
- Web3 Integration: ethers.js
- UI Framework: Material-UI

## Contributing
1. Fork the repository
2. Create feature branch
3. Commit changes
4. Open pull request