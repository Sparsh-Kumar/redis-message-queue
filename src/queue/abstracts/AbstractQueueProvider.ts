import Logger from '../../logger/Logger';
import { ConsumerGroupInfo, LooseObject } from '../../types';

export default abstract class AbstractQueueProvider {
  protected readonly logger: Logger;

  constructor(logger: Logger) {
    this.logger = logger;
  }
  abstract add(queueName: string, payload: LooseObject): Promise<string>;
  abstract createConsumerGroup(queueName: string): Promise<string>;
  abstract consumerGroupInfo(queueName: string): Promise<ConsumerGroupInfo[]>;
}
