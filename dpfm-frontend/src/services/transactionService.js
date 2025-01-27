import { utils } from 'ethers';

export const transactionService = {
  async addTransaction(contract, amount, category, description, isIncome) {
    try {
      const tx = await contract.addTransaction(
        utils.parseEther(amount.toString()),
        category,
        description,
        isIncome
      );
      return await tx.wait();
    } catch (error) {
      throw new Error(`Transaction failed: ${error.message}`);
    }
  },

  async getUserTransactions(contract) {
    try {
      const transactions = await contract.getUserTransactions();
      return transactions.map(tx => ({
        id: tx.id.toString(),
        amount: utils.formatEther(tx.amount),
        category: tx.category,
        description: tx.description,
        timestamp: new Date(tx.timestamp.toNumber() * 1000),
        isIncome: tx.isIncome
      }));
    } catch (error) {
      throw new Error(`Failed to fetch transactions: ${error.message}`);
    }
  }
};