import ConsumerGroup from '../../consumergroup/ConsumerGroup';
import { WorkerSubscriptionPayload } from '../types';

export default abstract class AbstractWorker {
  protected readonly consumerGroup: ConsumerGroup;

  protected readonly consumerName: string;

  constructor(
    consumerGroup: ConsumerGroup,
    consumerName = '',
  ) {
    this.consumerGroup = consumerGroup;
    this.consumerName = consumerName;
  }
  abstract subscribe(
    params: WorkerSubscriptionPayload,
  ): Promise<void>;
}
