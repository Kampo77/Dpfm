export const CONTRACT_ADDRESS = '0x1234567890123456789012345678901234567890'; // Replace with actual contract address
export const SUPPORTED_CHAIN_ID = 11155111; // Sepolia testnet

export const CONTRACT_ABI = [
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
  // Add other contract functions...
];