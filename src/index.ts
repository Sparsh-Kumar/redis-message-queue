import Redis from 'ioredis';
import dotenv from 'dotenv';
import Queue from './queue/Queue';
import EventEmitter from './events/emitter';
import RedisQueueProvider from './queue/providers/RedisQueueProvider';
import Logger from './logger/Logger';
import WinstonLogger from './logger/providers/WinstonLogger';
import ConsumerGroup from './consumergroup/ConsumerGroup';
import RedisConsumerGroupProvider from './consumergroup/providers/RedisConsumerGroupProvider';
import Events from './events/events';

dotenv.config();
const eventEmitter = new EventEmitter();

const winstonLogger = new WinstonLogger();
const logger = new Logger(winstonLogger);
const redisProvider = new Redis({
  port: +process.env.REDIS_PORT,
  host: process.env.REDIS_HOST,
});
const queueName = 'Tasks';
const queueProvider = new RedisQueueProvider(redisProvider, logger);
const queue = new Queue(queueName, queueProvider, eventEmitter);

const consumerGroupProvider = new RedisConsumerGroupProvider(redisProvider, logger);
const consumerGroupOne = new ConsumerGroup(queue, consumerGroupProvider, 'GrpOne', eventEmitter);
const consumerGroupTwo = new ConsumerGroup(queue, consumerGroupProvider, 'GrpTwo', eventEmitter);

let counter = 1;
setInterval(() => {
  eventEmitter.emit({
    event: Events.ADD_TO_QUEUE,
    args: [
      {
        counter,
      },
    ],
  });
  counter += 1;
}, 2000);

eventEmitter.emit({
  event: Events.INITIALIZE_CONSUMER_GROUP,
  args: [
    {},
  ],
});
