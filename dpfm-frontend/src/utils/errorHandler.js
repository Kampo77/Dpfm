export const ErrorTypes = {
  TRANSACTION: 'TRANSACTION',
  VALIDATION: 'VALIDATION',
  NETWORK: 'NETWORK',
  CONTRACT: 'CONTRACT',
  AUTHORIZATION: 'AUTHORIZATION'
};

export class DAppError extends Error {
  constructor(type, message, details = null) {
    super(message);
    this.type = type;
    this.details = details;
    this.timestamp = new Date();
  }

  static createTransactionError(message, details) {
    return new DAppError(ErrorTypes.TRANSACTION, message, details);
  }

  static createValidationError(message, details) {
    return new DAppError(ErrorTypes.VALIDATION, message, details);
  }
}

export const handleContractError = (error) => {
  if (error.code === -32603) {
    return new DAppError(
      ErrorTypes.TRANSACTION,
      'Transaction failed. Please check your balance and gas settings.',
      { originalError: error.message }
    );
  }

  if (error.code === 4001) {
    return new DAppError(
      ErrorTypes.TRANSACTION,
      'Transaction rejected by user',
      { userCancelled: true }
    );
  }

  return new DAppError(
    ErrorTypes.CONTRACT,
    'Contract operation failed',
    { originalError: error.message }
  );
};