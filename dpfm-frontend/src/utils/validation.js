export const validateTransaction = (data) => {
  const errors = {};

  // Amount validation
  if (!data.amount || isNaN(data.amount)) {
    errors.amount = 'Invalid amount';
  } else if (parseFloat(data.amount) <= 0) {
    errors.amount = 'Amount must be positive';
  }

  // Category validation
  if (!data.category?.trim()) {
    errors.category = 'Category is required';
  } else if (data.category.length > 50) {
    errors.category = 'Category too long';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};