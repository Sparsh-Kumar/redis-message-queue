import Events from '../events/events';
import EventEmitter from '../events/emitter';
import Queue from '../queue/Queue';
import { LooseObject } from '../types';
import AbstractConsumerGroupProvider from './abstracts/AbstractConsumerGroupProvider';
import { AcknowledgeMessagePayload, ConsumerGroupReadInputPayload } from './types';

export default class ConsumerGroup {
  private readonly consumerGroupName: string;

  private readonly queue: Queue;

  private readonly consumerGroupProvider: AbstractConsumerGroupProvider;

  private readonly eventEmitter: EventEmitter;

  constructor(
    queue: Queue,
    consumerGroupProvider: AbstractConsumerGroupProvider,
    consumerGroupName: string,
    eventEmitter: EventEmitter,
  ) {
    this.queue = queue;
    this.consumerGroupProvider = consumerGroupProvider;
    this.consumerGroupName = consumerGroupName;
    this.eventEmitter = eventEmitter;
    this.eventEmitter.on({
      event: Events.INITIALIZE_CONSUMER_GROUP,
      eventHandler: this.initialize.bind(this),
    });
    this.eventEmitter.on({
      event: Events.READ_FROM_CONSUMER_GROUP,
      eventHandler: this.readFromConsumerGroup.bind(this),
    });
    this.eventEmitter.on({
      event: Events.ACK_MESSAGE_IN_CONSUMER_GROUP,
      eventHandler: this.ackMessageInConsumerGroup.bind(this),
    });
    this.eventEmitter.on({
      event: Events.DESTROY_CONSUMER_GROUP,
      eventHandler: this.destroyConsumerGroup.bind(this),
    });
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
