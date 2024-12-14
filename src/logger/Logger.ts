import AbstractLoggerProvider from './abstracts/AbstractLoggerProvider';
import { LoggerMessage } from './types';

export default class Logger {
  private readonly logger: AbstractLoggerProvider;

  constructor(logger: AbstractLoggerProvider) {
    this.logger = logger;
  }

  public info(params: LoggerMessage): void {
    const { msg = '' } = params;
    this.logger.info(msg);
  }

  public warn(params: LoggerMessage): void {
    const { msg = '' } = params;
    this.logger.warn(msg);
  }

  public debug(params: LoggerMessage): void {
    const { msg = '' } = params;
    this.logger.debug(msg);
  }

  public error(params: LoggerMessage): void {
    const { msg = '' } = params;
    this.logger.error(msg);
  }
}
