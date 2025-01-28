export const CONTRACT_ADDRESS = '0x...'; // Your deployed contract address
export const ABI = [
  {
    "inputs": [
      { "internalType": "uint256", "name": "_amount", "type": "uint256" },
      { "internalType": "string", "name": "_category", "type": "string" }
    ],
    "name": "setBudget",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
  // Add other contract methods...
];