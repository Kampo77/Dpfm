import { ethers } from 'ethers';

export class SecurityService {
  constructor(contract) {
    this.contract = contract;
  }

  async validateTransactionSecurity(transaction) {
    const provider = this.contract.provider;
    const signer = this.contract.signer;

    // Check user balance
    const balance = await provider.getBalance(await signer.getAddress());
    const gasPrice = await provider.getGasPrice();
    const estimatedGas = await this.contract.estimateGas.addTransaction(
      transaction.amount,
      transaction.category,
      transaction.description,
      transaction.isExpense
    );

    const totalCost = gasPrice.mul(estimatedGas);

    if (balance.lt(totalCost)) {
      throw new Error('Insufficient balance for transaction');
    }

    // Check network status
    const network = await provider.getNetwork();
    if (network.chainId !== 11155111) { // Sepolia testnet
      throw new Error('Please connect to Sepolia testnet');
    }

    return {
      estimatedGas,
      gasPrice,
      totalCost: ethers.utils.formatEther(totalCost)
    };
  }
}