import Logger from '../../logger/Logger';
import { LooseObject } from '../../types';
import { ConsumerGroupInfo } from '../types';

export default abstract class AbstractQueueProvider {
  protected readonly logger: Logger;

  constructor(logger: Logger) {
    this.logger = logger;
  }
  abstract addToQueue(queueName: string, payload: LooseObject): Promise<string>;
  abstract createConsumerGroup(queueName: string): Promise<string>;
  abstract consumerGroupInfo(queueName: string): Promise<ConsumerGroupInfo[]>;
  abstract readFromConsumerGroup(
    queueName: string,
    consumerGroupName: string,
    consumerName: string,
  ): Promise<LooseObject[]>;
  abstract ackMessageInGroup(
    queueName: string,
    consumerGroupName: string,
    messageId: string
  ): Promise<void>;
}
