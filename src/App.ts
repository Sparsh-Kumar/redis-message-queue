import dotenv from 'dotenv';
import Redis from 'ioredis';
import Logger from './logger/Logger';
import WinstonLogger from './logger/providers/WinstonLogger';
import Queue from './queue/Queue';
import RedisQueueProvider from './queue/providers/RedisQueueProvider';
import ConsumerGroup from './consumergroup/ConsumerGroup';
import RedisConsumerGroupProvider from './consumergroup/providers/RedisConsumerGroupProvider';
import Worker from './worker/Worker';
import { CallBackFunction } from './worker/types';

dotenv.config();

const bootstrap = async () => {
  // Creation of logger
  const winstonLogger = new WinstonLogger();
  const logger = new Logger(winstonLogger);

  // Creation of Queue
  const queueName = 'msgq';
  const redisProvider = new Redis({
    port: +process.env.REDIS_PORT,
    host: process.env.REDIS_HOST,
  });
  const QueueProvider = new RedisQueueProvider(redisProvider, logger);
  const queue = new Queue(queueName, QueueProvider);

  // Addition of data into the queue
  // for (let i = 0; i < 100; i += 1) {
  //   await queue.addToQueue({ count: i + 1, name: 'Sparsh' });
  // }

  // Creation of consumer group 2
  const consumerGroupNameTwo = 'msgq_consumer_grp_2';
  const GroupProviderTwo = new RedisConsumerGroupProvider(redisProvider, logger);
  const consumerGroupTwo = new ConsumerGroup(consumerGroupNameTwo, GroupProviderTwo);
  await consumerGroupTwo.createConsumerGroup({
    queueName: queue.getName(),
  });

  const defaultCallbackFunction: CallBackFunction = async (arg) => {
    await new Promise((resolve, reject) => {
      console.log(arg);
      resolve(arg);
    });
  };

  // Adding consumer 1 to consumer group 1 & subscribing it.
  // const consumerOneGroupone = new Worker(queue, consumerGroupOne, 'ConsumerOne');
  // await consumerOneGroupone.subscribe({
  //   callback: defaultCallbackFunction,
  // });

  // Adding consumer 2 to consumergroup 1 & subscribing it.
  const consumerOneGrpTwo = new Worker(queue, consumerGroupTwo, 'ConsumerOne');
  await consumerOneGrpTwo.subscribe({
    callback: defaultCallbackFunction,
  });

  // Adding consumer 2 to consumergroup 1 & subscribing it.
  // const consumerTwoGrpOne = new Worker(queue, consumerGroupOne, 'ConsumerTwo');
  // await consumerTwoGrpOne.subscribe({
  //   callback: defaultCallbackFunction,
  // });
};

bootstrap().then(() => { }).catch((e) => {
  console.log(e);
});
