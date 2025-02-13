export const validateTransaction = (transaction) => {
  const errors = {};

  if (!transaction.amount || transaction.amount <= 0) {
    errors.amount = 'Amount must be greater than 0';
  }

  if (!transaction.category || transaction.category.trim().length === 0) {
    errors.category = 'Category is required';
  }

  if (transaction.description && transaction.description.length > 200) {
    errors.description = 'Description must not exceed 200 characters';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};