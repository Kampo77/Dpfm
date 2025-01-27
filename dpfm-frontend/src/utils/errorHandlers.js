export const handleTransactionError = (error) => {
  if (error.code === 4001) {
    return 'Transaction rejected by user';
  }
  if (error.code === -32603) {
    return 'Internal JSON-RPC error';
  }
  if (error.message.includes('insufficient funds')) {
    return 'Insufficient funds for transaction';
  }
  return 'Transaction failed. Please try again.';
};