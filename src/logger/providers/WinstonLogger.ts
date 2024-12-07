import winston from 'winston';
import * as _ from 'lodash';
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

  public getLoggerInstance(): winston.Logger {
    return this.winstonLogger;
  }
}
