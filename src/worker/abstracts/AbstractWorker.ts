import Queue from '../../queue/Queue';
import { WorkerSubscriptionPayload } from '../types';

export default abstract class AbstractWorker {
  protected readonly queue: Queue;

  protected readonly consumerName: string;

  constructor(queue: Queue, consumerName = '') {
    this.queue = queue;
    this.consumerName = consumerName;
  }
  abstract subscribe(
    params: WorkerSubscriptionPayload,
  ): Promise<void>;
}
