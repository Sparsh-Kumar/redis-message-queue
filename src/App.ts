import dotenv from 'dotenv';
import Logger from './logger/Logger';
import WinstonLogger from './logger/providers/WinstonLogger';

import Queue from './queue/Queue';
import RedisProvider from './queue/providers/Redis';
import Worker from './worker/Worker';
import { LooseObject } from './types';

dotenv.config();

const bootstrap = async () => {
  const winstonLogger = new WinstonLogger();
  const logger = new Logger(winstonLogger);
  const redisProvider = new RedisProvider(logger);
  const queue = new Queue('msgq', redisProvider);
  const payload = {
    name: 'Sparsh Kumar',
    age: 28,
  };
  /*
  for (let i = 0; i < 60; i += 1) {
    await queue.addToQueue(payload);
  } */
  const consumerGroupName = await queue.createConsumerGroup();
  const info = await queue.getConsumerGroupsInfo();
  console.log(info);

  const consumerName = 'Consumer2';
  const worker = new Worker(queue, consumerName);
  const callback = (arg: LooseObject) => {
    console.log(arg);
    return {};
  };
  await worker.subscribe({
    callback,
    consumerGroupName,
  });
};

bootstrap().then(() => { }).catch(() => { });
