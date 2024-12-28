export type LooseObject = {
  [key: string]: any;
};

export type RedisMessageQueueParams = {
  redisMessageQueueName: string;
  redisUrl: string;
  redisPort: number;
  failOverQueueHandling?: boolean;
};

export type CallBackFunction
  = (data: LooseObject) => Promise<LooseObject | void>
  | LooseObject
  | void;

export type RedisMessageQueueConsumeParams = {
  callback: CallBackFunction;
  failOverCallback?: CallBackFunction;
  count: number;
};
