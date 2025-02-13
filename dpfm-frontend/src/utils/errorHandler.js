export const ERROR_TYPES = {
  TRANSACTION: 'TRANSACTION',
  CONNECTION: 'CONNECTION',
  CONTRACT: 'CONTRACT',
  VALIDATION: 'VALIDATION'
};

export class DAppError extends Error {
  constructor(type, message, details = null) {
    super(message);
    this.type = type;
    this.details = details;
  }
}

export const handleError = (error) => {
  if (error instanceof DAppError) {
    return {
      message: error.message,
      type: error.type,
      details: error.details
    };
  }

  if (error.code === 4001) {
    return {
      message: 'Transaction rejected by user',
      type: ERROR_TYPES.TRANSACTION
    };
  }

  if (error.code === -32603) {
    return {
      message: 'Transaction failed. Please check gas settings',
      type: ERROR_TYPES.TRANSACTION
    };
  }

  return {
    message: 'An unexpected error occurred',
    type: ERROR_TYPES.CONTRACT,
    details: error.message
  };
};