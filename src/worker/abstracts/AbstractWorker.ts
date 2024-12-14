import ConsumerGroup from '../../consumergroup/ConsumerGroup';
import Queue from '../../queue/Queue';
import { WorkerSubscriptionPayload } from '../types';

export default abstract class AbstractWorker {
  protected readonly queue: Queue;

  protected readonly consumerGroup: ConsumerGroup;

  protected readonly consumerName: string;

  constructor(
    queue: Queue,
    consumerGroup: ConsumerGroup,
    consumerName = '',
  ) {
    this.queue = queue;
    this.consumerGroup = consumerGroup;
    this.consumerName = consumerName;
  }
  abstract subscribe(
    params: WorkerSubscriptionPayload,
  ): Promise<void>;
}
