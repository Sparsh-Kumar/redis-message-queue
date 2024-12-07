import winston from 'winston';
import { RedisClientType } from 'redis';

export type LooseObject = {
  [key: string]: any;
};

export type QueueWriteInfo = {
  name: string;
  payload: LooseObject;
};

export type QueueReadInfo = {
  name: string;
  payload: LooseObject;
};

export enum WinstonLoggerLevels {
  ERROR = 'error',
  WARN = 'warn',
  INFO = 'info',
  HTTP = 'http',
  VERBOSE = 'verbose',
  DEBUG = 'debug',
  SILLY = 'silly',
}

export type QueueManagerType = RedisClientType;
export type LoggerTypes = winston.Logger;
