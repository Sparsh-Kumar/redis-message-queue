import Redis from 'ioredis';
import * as _ from 'lodash';
import { ConsumerGroupInfo, LooseObject } from '../../types';
import AbstractQueueProvider from '../abstracts/AbstractQueueProvider';
import Logger from '../../logger/Logger';
import BaseError from '../../errors/base-error';
import ErrorTypes from '../../errors/error-types';

export default class RedisProvider extends AbstractQueueProvider {
  private redisClient: Redis;

  constructor(logger: Logger) {
    super(logger);
    this.redisClient = new Redis({
      port: +process.env.REDIS_PORT,
      host: process.env.REDIS_HOST,
    });
  }

  public async add(queueName = '', payload: LooseObject = {}): Promise<string> {
    if (!queueName) throw new BaseError(ErrorTypes.QUEUE_ERROR, 'Please provide a non empty queue name.');
    if (_.isEmpty(payload)) throw new BaseError(ErrorTypes.PAYLOAD_ERROR, 'Please provide a non empty payload.');
    const stringPayload = JSON.stringify(payload);
    // eslint-disable-next-line  @typescript-eslint/no-unsafe-call
    return (this.redisClient.xadd(queueName, '*', stringPayload, Math.random()));
  }

  public async createConsumerGroup(queueName = ''): Promise<string> {
    if (!queueName) throw new BaseError(ErrorTypes.QUEUE_ERROR, 'Please provide a non empty queue name.');
    const consumerGroups: ConsumerGroupInfo[] = await this.consumerGroupInfo(queueName);
    const consumerGroupsCount = consumerGroups?.length || 0;
    const name = `consumer_group_${queueName}_${consumerGroupsCount + 1}`;
    await this.redisClient.call('XGROUP', 'CREATE', queueName, name, '$', 'MKSTREAM');
    return name;
  }

  public async consumerGroupInfo(queueName = ''): Promise<ConsumerGroupInfo[]> {
    if (!queueName) throw new BaseError(ErrorTypes.QUEUE_ERROR, 'Please provide a non empty queue name.');
    const consumerGroupInfo: LooseObject[] = <LooseObject[]> await this.redisClient.call('XINFO', 'GROUPS', queueName);
    return consumerGroupInfo.map((group: LooseObject) => ({
      groupName: <string>group[1],
      consumers: <number>group[3],
      pendingMessages: <number>group[5],
      lastDeliveredId: <string>group[7],
    }));
  }
}
