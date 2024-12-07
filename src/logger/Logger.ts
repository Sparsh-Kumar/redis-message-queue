import AbstractLoggerProvider from './abstracts/AbstractLoggerProvider';

export default class Logger {
  private readonly logger: AbstractLoggerProvider;

  constructor(logger: AbstractLoggerProvider) {
    this.logger = logger;
  }

  public info(msg: string): void {
    this.logger.info(msg);
  }

  public warn(msg: string): void {
    this.logger.warn(msg);
  }

  public debug(msg: string): void {
    this.logger.debug(msg);
  }

  public error(msg: string): void {
    this.logger.error(msg);
  }
}
