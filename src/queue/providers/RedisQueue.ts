import Redis from 'ioredis';
import * as _ from 'lodash';
import { LooseObject } from '../../types';
import { ConsumerGroupInfo } from '../types';
import AbstractQueueProvider from '../abstracts/AbstractQueueProvider';
import ExtendedError from '../../errors/base-error';
import ErrorTypes from '../../errors/error-types';

export default class RedisQueueProvider extends AbstractQueueProvider {
  private redisClient: Redis;

  public async addToQueue(
    queueName = '',
    payload: LooseObject = {},
  ): Promise<string> {
    if (!queueName) throw new ExtendedError(ErrorTypes.QUEUE_ERROR, 'Please provide a non empty queue name.');
    if (_.isEmpty(payload)) throw new ExtendedError(ErrorTypes.PAYLOAD_ERROR, 'Please provide a non empty payload.');
    const stringPayload = JSON.stringify(payload);
    return (this.redisClient.xadd(queueName, '*', stringPayload, Math.random()));
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
}
