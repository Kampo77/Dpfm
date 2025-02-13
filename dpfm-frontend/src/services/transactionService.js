import { ethers } from 'ethers';
import { ERROR_TYPES } from '../utils/errorHandling';

export class TransactionService {
  constructor(contract) {
    this.contract = contract;
  }

  async addTransaction(data) {
    try {
      const tx = await this.contract.addTransaction(
        ethers.utils.parseEther(data.amount),
        data.category,
        data.description,
        data.isExpense,
        {
          gasLimit: 200000,
        }
      );

      const receipt = await tx.wait();
      return {
        success: true,
        hash: receipt.transactionHash,
        blockNumber: receipt.blockNumber
      };
    } catch (error) {
      throw {
        type: ERROR_TYPES.TRANSACTION,
        message: error.message,
        code: error.code
      };
    }
  }

  async getBudget() {
    try {
      const budget = await this.contract.getBudget();
      return ethers.utils.formatEther(budget);
    } catch (error) {
      throw {
        type: ERROR_TYPES.CONTRACT,
        message: 'Failed to fetch budget',
        details: error.message
      };
    }
  }
}