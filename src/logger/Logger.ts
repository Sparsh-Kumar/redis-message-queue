import {
  blue, green, red, yellow,
} from 'colorette';
import { LoggerTypes } from '../types';

export default class Logger {
  private readonly logger: LoggerTypes;

  constructor(logger: LoggerTypes) {
    this.logger = logger;
  }

  public info(msg: string): void {
    this.logger.info(`[*] ${green(msg)}`);
  }

  public warn(msg: string): void {
    this.logger.warn(`[*] ${yellow(msg)}`);
  }

  public debug(msg: string): void {
    this.logger.debug(`[+] ${blue(msg)}`);
  }

  public error(msg: string): void {
    this.logger.error(`[-] ${red(msg)}`);
  }
}
