export const CONTRACT_CONFIG = {
  MAX_DESCRIPTION_LENGTH: 200,
  MIN_TRANSACTION_AMOUNT: 0,
  GAS_LIMIT: 1500000,
  MAX_FEE_PER_GAS: 100000000,
  MAX_PRIORITY_FEE_PER_GAS: 100000000
};

export const ERROR_MESSAGES = {
  INVALID_AMOUNT: 'Amount must be greater than 0',
  EMPTY_CATEGORY: 'Category is required',
  DESCRIPTION_TOO_LONG: 'Description must not exceed 200 characters',
  TRANSACTION_FAILED: 'Transaction failed',
  UNAUTHORIZED: 'You are not authorized to perform this action',
  CONNECTION_FAILED: 'Failed to connect to wallet'
};