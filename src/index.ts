/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-continue */

import Redis from 'ioredis';
import RedisConsumerGroupProvider from './consumergroup/providers/RedisConsumerGroupProvider';
import RedisQueueProvider from './queue/providers/RedisQueueProvider';
import Queue from './queue/Queue';
import ConsumerGroup from './consumergroup/ConsumerGroup';
import {
  CallBackFunction, LooseObject, RedisMessageQueueConsumeParams, RedisMessageQueueParams,
} from './types';
import { AcknowledgeMessagePayload } from './consumergroup/types';
import { QueueAdditionPayload } from './queue/types';

export default class RedisMessageQueue {
  private readonly redisMessageQueueName: string;

  private readonly failOverRedisMessageQueueName: string;

  private readonly redisConsumerGroupName: string;

  private readonly failOverRedisConsumerGroupName: string;

  private readonly redisUrl: string;

  private readonly redisPort: number;

  private readonly failOverQueueHandling: boolean;

  private readonly redisClient: Redis;

  private readonly redisQueueProvider: RedisQueueProvider;

  private readonly redisConsumerGroupProvider: RedisConsumerGroupProvider;

  private readonly Queue: Queue;

  private readonly FailOverQueue: Queue;

  private readonly ConsumerGroup: ConsumerGroup;

  private readonly FailOverConsumerGroup: ConsumerGroup;

  constructor(
    params: RedisMessageQueueParams,
  ) {
    const {
      redisMessageQueueName = 'queue',
      redisUrl = 'localhost',
      redisPort = 6379,
      failOverQueueHandling = false,
    } = params;

    this.redisMessageQueueName = redisMessageQueueName;
    this.redisConsumerGroupName = `${this.redisMessageQueueName}_group`;
    this.failOverRedisMessageQueueName = `failover_${this.redisMessageQueueName}`;
    this.failOverRedisConsumerGroupName = `${this.failOverRedisMessageQueueName}_group`;
    this.redisUrl = redisUrl;
    this.redisPort = redisPort;
    this.failOverQueueHandling = failOverQueueHandling;
    this.redisClient = new Redis({
      port: this.redisPort,
      host: this.redisUrl,
    });
    this.redisQueueProvider = new RedisQueueProvider(this.redisClient);
    this.redisConsumerGroupProvider = new RedisConsumerGroupProvider(this.redisClient);
    this.Queue = new Queue(
      this.redisMessageQueueName,
      this.redisQueueProvider,
    );
    this.FailOverQueue = new Queue(
      this.failOverRedisMessageQueueName,
      this.redisQueueProvider,
    );
    this.ConsumerGroup = new ConsumerGroup(
      this.Queue,
      this.redisConsumerGroupProvider,
      this.redisConsumerGroupName,
    );
    this.FailOverConsumerGroup = new ConsumerGroup(
      this.FailOverQueue,
      this.redisConsumerGroupProvider,
      this.failOverRedisConsumerGroupName,
    );
    this.initializeQueue();
  }

  public async initializeQueue(): Promise<void> {
    await this.Queue.initialize();
    await this.ConsumerGroup.initialize();
    await this.FailOverQueue.initialize();
    await this.FailOverConsumerGroup.initialize();
  }

  public async produce(params: QueueAdditionPayload): Promise<void> {
    await this.Queue.addToQueue(params);
  }

  public async consume(params: RedisMessageQueueConsumeParams): Promise<void> {
    const defaultFunc = (arg) => { console.log(arg); };
    const {
      callback = defaultFunc,
      failOverCallback = defaultFunc,
      count = 1,
    }: {
      callback: CallBackFunction,
      failOverCallback?: CallBackFunction,
      count: number
    } = params;
    const result = await this.ConsumerGroup.readFromConsumerGroupInBlockingMode({
      consumerName: this.redisConsumerGroupName,
      count,
    });
    let items: [string, [string]][] = [];
    if (
      result
      && Array.isArray(result)
      && result[0]
      && Array.isArray(result[0])
    ) {
      [[, items]] = result;
    }
    for (let i = 0; i < items?.length; i += 1) {
      const item = items[i];
      const [messageId = '', payloadInfo] = item;
      const [message] = payloadInfo;
      const parsedMessage = <LooseObject>(JSON.parse(message));
      try {
        const { queueInitialized, queueName } = parsedMessage;
        if (queueInitialized && queueName === this.Queue.getName()) continue;
        const ackPayload: AcknowledgeMessagePayload = {
          messageId,
        };
        await callback(parsedMessage);
        await this.ConsumerGroup.ackMessageInConsumerGroup(ackPayload);
      } catch (e) {
        if (this.failOverQueueHandling) {
          await this.FailOverQueue.addToQueue(parsedMessage);
        }
        await failOverCallback(parsedMessage);
      }
    }
    this.consume({
      callback,
      failOverCallback,
      count,
    });
  }
}
