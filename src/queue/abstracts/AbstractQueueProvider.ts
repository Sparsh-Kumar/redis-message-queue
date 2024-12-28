import { LooseObject } from '../../types';
import { ConsumerGroupInfo, QueueProvider } from '../types';

export default abstract class AbstractQueueProvider {
  protected readonly queueProvider: QueueProvider;

  constructor(
    queueProvider: QueueProvider,
  ) {
    this.queueProvider = queueProvider;
  }
  abstract isQueueAlreadyExists(queueName: string): Promise<boolean>;
  abstract addToQueue(queueName: string, payload: LooseObject): Promise<string>;
  abstract fetchAllRecords(queueName: string): Promise<LooseObject[]>;
  abstract deleteQueue(queueName: string): Promise<void>;
  abstract consumerGroupInfo(
    queueName: string,
    consumerGroupName: string
  ): Promise<ConsumerGroupInfo[]>;
  abstract getConsumerGroups(queueName: string): Promise<LooseObject[]>;
}
