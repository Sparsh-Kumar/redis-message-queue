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

export type ConsumerGroupInfo = {
  groupName: string;
  consumers: number;
  pendingMessages: number;
  lastDeliveredId: string;
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
