import winston from 'winston';
import * as _ from 'lodash';
import {
  blue, green, red, yellow,
} from 'colorette';
import { WinstonLoggerLevels } from '../../types';
import AbstractLoggerProvider from '../abstracts/AbstractLoggerProvider';

export default class WinstonLogger extends AbstractLoggerProvider {
  private readonly winstonLogger: winston.Logger;

  private readonly winstonLoggerOptions: winston.LoggerOptions = {
    level: WinstonLoggerLevels.SILLY,
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.printf((info: winston.Logform.TransformableInfo): string => {
        const { level = '', message = '', timestamp = '' } = info;
        return `[${<string>timestamp}] ${level.toUpperCase()}: ${<string>message}`;
      }),
    ),
    transports: [
      new winston.transports.File({
        filename: 'application.log',
        level: WinstonLoggerLevels.SILLY,
      }),
      new winston.transports.Console({
        level: WinstonLoggerLevels.SILLY,
      }),
    ],
  };

  constructor(winstonLoggerOptions: winston.LoggerOptions = {}) {
    super();
    if (!_.isEmpty(winstonLoggerOptions)) this.winstonLoggerOptions = winstonLoggerOptions;
    this.winstonLogger = winston.createLogger(this.winstonLoggerOptions);
  }

  public info(msg: string): void {
    this.winstonLogger.info(`[*] ${green(msg)}`);
  }

  public warn(msg: string): void {
    this.winstonLogger.warn(`[*] ${yellow(msg)}`);
  }

  public debug(msg: string): void {
    this.winstonLogger.debug(`[+] ${blue(msg)}`);
  }

  public error(msg: string): void {
    this.winstonLogger.error(`[-] ${red(msg)}`);
  }
}
