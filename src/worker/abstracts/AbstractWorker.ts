import { LooseObject } from '../../types';
import ConsumerGroup from '../../consumergroup/ConsumerGroup';
import { WorkerSubscriptionPayload } from '../types';
import Queue from '../../queue/Queue';

export default abstract class AbstractWorker {
  protected readonly failOverQueue: Queue;

  protected readonly consumerGroup: ConsumerGroup;

  protected readonly consumerName: string;

  constructor(
    failOverQueue: Queue,
    consumerGroup: ConsumerGroup,
    consumerName = '',
  ) {
    this.failOverQueue = failOverQueue;
    this.consumerGroup = consumerGroup;
    this.consumerName = consumerName;
  }
  abstract subscribe(
    params: WorkerSubscriptionPayload,
  ): Promise<void | LooseObject[]>;
  abstract getName(): string;
}
