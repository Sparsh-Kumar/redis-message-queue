import Queue from '../queue/Queue';
import { LooseObject } from '../types';
import AbstractConsumerGroupProvider from './abstracts/AbstractConsumerGroupProvider';
import { AcknowledgeMessagePayload, ConsumerGroupReadInputPayload } from './types';

export default class ConsumerGroup {
  private readonly consumerGroupName: string;

  private readonly queue: Queue;

  private readonly consumerGroupProvider: AbstractConsumerGroupProvider;

  constructor(
    queue: Queue,
    consumerGroupProvider: AbstractConsumerGroupProvider,
    consumerGroupName: string,
  ) {
    this.queue = queue;
    this.consumerGroupProvider = consumerGroupProvider;
    this.consumerGroupName = consumerGroupName;
  }

  public async initialize(): Promise<void> {
    await this.consumerGroupProvider.createConsumerGroup(
      this.queue.getName(),
      this.consumerGroupName,
    );
  }

  public async readFromConsumerGroup(
    params: ConsumerGroupReadInputPayload,
  ): Promise<LooseObject[]> {
    const { consumerName = '', count = +process.env.CONCURRENCY } = params;
    return this.consumerGroupProvider.readFromConsumerGroup(
      this.queue.getName(),
      this.consumerGroupName,
      consumerName,
      count,
    );
  }

  public async ackMessageInConsumerGroup(
    params: AcknowledgeMessagePayload,
  ): Promise<void> {
    const { messageId = '' } = params;
    return this.consumerGroupProvider.ackMessageInConsumerGroup(
      this.queue.getName(),
      this.consumerGroupName,
      messageId,
    );
  }

  public async destroyConsumerGroup(): Promise<void> {
    return this.consumerGroupProvider.destroyConsumerGroup(
      this.queue.getName(),
      this.consumerGroupName,
    );
  }

  public getName(): string {
    return this.consumerGroupName;
  }
}
