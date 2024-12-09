import AbstractLoggerProvider from './abstracts/AbstractLoggerProvider';

export default class Logger {
  private readonly logger: AbstractLoggerProvider;

  constructor(logger: AbstractLoggerProvider) {
    this.logger = logger;
  }

  public info(msg = ''): void {
    this.logger.info(msg);
  }

  public warn(msg = ''): void {
    this.logger.warn(msg);
  }

  public debug(msg = ''): void {
    this.logger.debug(msg);
  }

  public error(msg = ''): void {
    this.logger.error(msg);
  }
}
