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