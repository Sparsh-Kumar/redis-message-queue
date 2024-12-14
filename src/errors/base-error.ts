import ErrorTypes from './error-types';

export default class ExtendedError extends Error {
  public readonly errorCode: number;

  public readonly errorType: ErrorTypes;

  constructor(errorType: ErrorTypes, message = '') {
    super(message);
    this.errorType = errorType;
  }
}
