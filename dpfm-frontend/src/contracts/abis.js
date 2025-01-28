export const FINANCIAL_MANAGER_ABI = [
  {
    "inputs": [
      { "internalType": "uint256", "name": "_amount", "type": "uint256" },
      { "internalType": "string", "name": "_category", "type": "string" },
      { "internalType": "string", "name": "_description", "type": "string" },
      { "internalType": "bool", "name": "_isIncome", "type": "bool" }
    ],
    "name": "addTransaction",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  // Add other contract methods...
];