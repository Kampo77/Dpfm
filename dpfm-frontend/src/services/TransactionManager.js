import { ethers } from 'ethers';

export class TransactionManager {
  constructor(contract) {
    this.contract = contract;
    this.pendingTransactions = new Set();
    this.transactionTimeouts = new Map();
  }

  async executeTransaction(params) {
    const transactionId = this.generateTransactionId(params);
    
    if (this.pendingTransactions.has(transactionId)) {
      throw new Error('Transaction already in progress');
    }

    try {
      this.pendingTransactions.add(transactionId);
      this.setTransactionTimeout(transactionId);

      const tx = await this.contract.addTransaction(
        ethers.utils.parseEther(params.amount.toString()),
        params.category,
        params.description,
        params.isExpense,
        { gasLimit: 200000 }
      );

      const receipt = await tx.wait();
      this.clearTransactionTimeout(transactionId);
      return receipt;

    } finally {
      this.pendingTransactions.delete(transactionId);
    }
  }

  private generateTransactionId(params) {
    return `${params.amount}-${params.category}-${Date.now()}`;
  }

  private setTransactionTimeout(transactionId) {
    const timeout = setTimeout(() => {
      this.pendingTransactions.delete(transactionId);
      this.transactionTimeouts.delete(transactionId);
    }, 60000); // 1 minute timeout

    this.transactionTimeouts.set(transactionId, timeout);
  }

  private clearTransactionTimeout(transactionId) {
    const timeout = this.transactionTimeouts.get(transactionId);
    if (timeout) {
      clearTimeout(timeout);
      this.transactionTimeouts.delete(transactionId);
    }
  }
}