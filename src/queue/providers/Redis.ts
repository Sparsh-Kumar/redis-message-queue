import Redis from 'ioredis';
import * as _ from 'lodash';
import { LooseObject } from '../../types';
import { ConsumerGroupInfo } from '../types';
import AbstractQueueProvider from '../abstracts/AbstractQueueProvider';
import Logger from '../../logger/Logger';
import ExtendedError from '../../errors/base-error';
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

  public async addToQueue(
    queueName = '',
    payload: LooseObject = {},
  ): Promise<string> {
    if (!queueName) throw new ExtendedError(ErrorTypes.QUEUE_ERROR, 'Please provide a non empty queue name.');
    if (_.isEmpty(payload)) throw new ExtendedError(ErrorTypes.PAYLOAD_ERROR, 'Please provide a non empty payload.');
    const stringPayload = JSON.stringify(payload);
    return (this.redisClient.xadd(queueName, '*', stringPayload, Math.random()));
  }

  public async createConsumerGroup(
    queueName = '',
  ): Promise<string> {
    if (!queueName) throw new ExtendedError(ErrorTypes.QUEUE_ERROR, 'Please provide a non empty queue name.');
    const consumerGroups: ConsumerGroupInfo[] = await this.consumerGroupInfo(queueName);
    const consumerGroupsCount = consumerGroups?.length || 0;
    const name = `consumer_group_${queueName}_${consumerGroupsCount + 1}`;
    await this.redisClient.call('XGROUP', 'CREATE', queueName, name, '0', 'MKSTREAM');
    return name;
  }

  public async consumerGroupInfo(
    queueName = '',
  ): Promise<ConsumerGroupInfo[]> {
    if (!queueName) throw new ExtendedError(ErrorTypes.QUEUE_ERROR, 'Please provide a non empty queue name.');
    const consumerGroupInfo: LooseObject[] = <LooseObject[]> await this.redisClient.call('XINFO', 'GROUPS', queueName);
    return consumerGroupInfo.map((group: LooseObject) => ({
      groupName: <string>group[1],
      consumers: <number>group[3],
      pendingMessages: <number>group[5],
      lastDeliveredId: <string>group[7],
    }));
  }

  public async readFromConsumerGroup(
    queueName = '',
    consumerGroupName = '',
    consumerName = '',
  ): Promise<LooseObject[]> {
    if (!queueName) throw new ExtendedError(ErrorTypes.QUEUE_ERROR, 'Please provide a non empty queue name.');
    if (!consumerGroupName) throw new ExtendedError(ErrorTypes.CONSUMER_GROUP_ERROR, 'Please provide a non empty consumer group name.');
    if (!consumerName) throw new ExtendedError(ErrorTypes.CONSUMER_ERROR, 'Please provide a non empty consumer name.');
    const consumerGroupData = <LooseObject[]> await this.redisClient.call(
      'XREADGROUP',
      'GROUP',
      consumerGroupName,
      consumerName,
      'COUNT',
      process.env.CONCURRENCY,
      'STREAMS',
      queueName,
      '>',
    );
    return consumerGroupData;
  }

  public async ackMessageInGroup(
    queueName = '',
    consumerGroupName = '',
    messageId = '',
  ): Promise<void> {
    if (!queueName) throw new ExtendedError(ErrorTypes.QUEUE_ERROR, 'Please provide a non empty queue name.');
    if (!consumerGroupName) throw new ExtendedError(ErrorTypes.CONSUMER_GROUP_ERROR, 'Please provide a non empty consumer group name.');
    if (!messageId) throw new ExtendedError(ErrorTypes.MESSAGE_ID_ERROR, 'Please provide a non empty message Id.');
    await this.redisClient.call(
      'XACK',
      queueName,
      consumerGroupName,
      messageId,
    );
  }
}
