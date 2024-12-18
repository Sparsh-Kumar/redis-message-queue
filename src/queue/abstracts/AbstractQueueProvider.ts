import Logger from '../../logger/Logger';
import { LooseObject } from '../../types';
import { ConsumerGroupInfo, QueueProvider } from '../types';

export default abstract class AbstractQueueProvider {
  protected readonly queueProvider: QueueProvider;

  protected readonly logger: Logger;

  constructor(
    queueProvider: QueueProvider,
    logger: Logger,
  ) {
    this.queueProvider = queueProvider;
    this.logger = logger;
  }
  abstract addToQueue(queueName: string, payload: LooseObject): Promise<string>;
  abstract fetchAllRecords(queueName: string): Promise<LooseObject[]>;
  abstract deleteQueue(queueName: string): Promise<void>;
  abstract consumerGroupInfo(
    queueName: string,
    consumerGroupName: string
  ): Promise<ConsumerGroupInfo[]>;
}
