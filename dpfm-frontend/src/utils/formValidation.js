export const validateTransactionForm = (values) => {
  const errors = {};

  if (!values.amount || parseFloat(values.amount) <= 0) {
    errors.amount = 'Amount must be greater than 0';
  }

  if (!values.category || values.category.trim() === '') {
    errors.category = 'Category is required';
  }

  if (values.description && values.description.length > 200) {
    errors.description = 'Description must be less than 200 characters';
  }

  return errors;
};