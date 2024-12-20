import Logger from '../../logger/Logger';
import { LooseObject } from '../../types';
import { ConsumerGroupProvider } from '../types';

export default abstract class AbstractConsumerGroupProvider {
  protected readonly consumerGroupProvider: ConsumerGroupProvider;

  protected readonly logger: Logger;

  constructor(
    consumerGroupProvider: ConsumerGroupProvider,
    logger: Logger,
  ) {
    this.consumerGroupProvider = consumerGroupProvider;
    this.logger = logger;
  }
  abstract createConsumerGroup(
    queueName: string,
    consumerGroupName: string
  ): Promise<string>;
  abstract readFromConsumerGroup(
    queueName: string,
    consumerGroupName: string,
    consumerName: string,
    count: number,
  ): Promise<LooseObject[]>;
  abstract ackMessageInConsumerGroup(
    queueName: string,
    consumerGroupName: string,
    messageId: string
  ): Promise<void>;
  abstract destroyConsumerGroup(
    queueName: string,
    consumerGroupName: string,
  ): Promise<void>;
}
