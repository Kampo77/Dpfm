import { ethers } from 'ethers';

export const validateEthereumAddress = (address) => {
  if (!address) return 'Address is required';
  if (!/^0x[a-fA-F0-9]{40}$/.test(address)) return 'Invalid Ethereum address';
  return null;
};

export const validateAmount = (amount) => {
  if (!amount) return 'Amount is required';
  if (isNaN(amount) || parseFloat(amount) <= 0) return 'Amount must be greater than 0';
  return null;
};

export const validateCategory = (category) => {
  if (!category || category.trim().length === 0) return 'Category is required';
  if (category.length > 50) return 'Category must be less than 50 characters';
  return null;
};

export const validateTransaction = (data) => {
  const errors = {};

  // Amount validation
  if (!data.amount) {
    errors.amount = 'Amount is required';
  } else {
    try {
      const amount = ethers.utils.parseEther(data.amount);
      if (amount.lte(0)) {
        errors.amount = 'Amount must be greater than 0';
      }
    } catch {
      errors.amount = 'Invalid amount format';
    }
  }

  // Category validation
  if (!data.category?.trim()) {
    errors.category = 'Category is required';
  } else if (data.category.length > 50) {
    errors.category = 'Category must be less than 50 characters';
  }

  // Description validation
  if (data.description?.length > 200) {
    errors.description = 'Description must be less than 200 characters';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};