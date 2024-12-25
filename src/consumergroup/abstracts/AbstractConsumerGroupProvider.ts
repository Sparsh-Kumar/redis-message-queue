import { LooseObject } from '../../types';
import { ConsumerGroupProvider } from '../types';

export default abstract class AbstractConsumerGroupProvider {
  protected readonly consumerGroupProvider: ConsumerGroupProvider;

  constructor(
    consumerGroupProvider: ConsumerGroupProvider,
  ) {
    this.consumerGroupProvider = consumerGroupProvider;
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
