import * as _ from 'lodash';
import { LooseObject } from '../../types';
import AbstractConsumerGroupProvider from '../abstracts/AbstractConsumerGroupProvider';
import ExtendedError from '../../errors/base-error';
import ErrorTypes from '../../errors/error-types';

export default class RedisConsumerGroupProvider extends AbstractConsumerGroupProvider {
  public async createConsumerGroup(
    queueName = '',
    consumerGroupName = '',
  ): Promise<string> {
    if (!queueName) throw new ExtendedError(ErrorTypes.QUEUE_ERROR, 'Please provide a non empty queue name.');
    if (!consumerGroupName) throw new ExtendedError(ErrorTypes.CONSUMER_GROUP_ERROR, 'Please provide a non empty consumer group name');
    await this.consumerGroupProvider.call('XGROUP', 'CREATE', queueName, consumerGroupName, '0', 'MKSTREAM');
    return consumerGroupName;
  }

  public async readFromConsumerGroup(
    queueName = '',
    consumerGroupName = '',
    consumerName = '',
    count = 1,
  ): Promise<LooseObject[]> {
    if (!queueName) throw new ExtendedError(ErrorTypes.QUEUE_ERROR, 'Please provide a non empty queue name.');
    if (!consumerGroupName) throw new ExtendedError(ErrorTypes.CONSUMER_GROUP_ERROR, 'Please provide a non empty consumer group name.');
    if (!consumerName) throw new ExtendedError(ErrorTypes.CONSUMER_ERROR, 'Please provide a non empty consumer name.');
    const consumerGroupData = <LooseObject[]> await this.consumerGroupProvider.call(
      'XREADGROUP',
      'GROUP',
      consumerGroupName,
      consumerName,
      'COUNT',
      count,
      'STREAMS',
      queueName,
      '>',
    );
    return consumerGroupData;
  }

  public async ackMessageInConsumerGroup(
    queueName = '',
    consumerGroupName = '',
    messageId = '',
  ): Promise<void> {
    if (!queueName) throw new ExtendedError(ErrorTypes.QUEUE_ERROR, 'Please provide a non empty queue name.');
    if (!consumerGroupName) throw new ExtendedError(ErrorTypes.CONSUMER_GROUP_ERROR, 'Please provide a non empty consumer group name.');
    if (!messageId) throw new ExtendedError(ErrorTypes.MESSAGE_ID_ERROR, 'Please provide a non empty message Id.');
    await this.consumerGroupProvider.call(
      'XACK',
      queueName,
      consumerGroupName,
      messageId,
    );
  }

  public async destroyConsumerGroup(
    queueName = '',
    consumerGroupName = '',
  ): Promise<void> {
    if (!queueName) throw new ExtendedError(ErrorTypes.QUEUE_ERROR, 'Please provide a non empty queue name.');
    if (!consumerGroupName) throw new ExtendedError(ErrorTypes.CONSUMER_GROUP_ERROR, 'Please provide a non empty consumer group name.');
    await this.consumerGroupProvider.xgroup(
      'DESTROY',
      queueName,
      consumerGroupName,
    );
  }
}
