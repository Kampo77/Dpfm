export const ERROR_TYPES = {
  NETWORK: 'Network error',
  CONTRACT: 'Contract error',
  USER: 'User error',
  VALIDATION: 'Validation error'
};

export class DAppError extends Error {
  constructor(type, message, details = null) {
    super(message);
    this.type = type;
    this.details = details;
  }
}