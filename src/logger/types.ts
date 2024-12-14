export type LoggerMessage = {
  msg: string;
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
