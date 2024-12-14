import { LooseObject } from '../types';
import AbstractConsumerGroupProvider from './abstracts/AbstractConsumerGroupProvider';
import { AcknowledgeMessagePayload, ConsumerGroupReadInputPayload, CreateConsumerGroupPayload } from './types';

export default class ConsumerGroup {
  private readonly name: string;

  private readonly consumerGroupProvider: AbstractConsumerGroupProvider;

  constructor(
    name: string,
    consumerGroupProvider: AbstractConsumerGroupProvider,
  ) {
    this.name = name;
    this.consumerGroupProvider = consumerGroupProvider;
  }

  public async createConsumerGroup(params: CreateConsumerGroupPayload): Promise<string> {
    const { queueName = '' } = params;
    return this.consumerGroupProvider.createConsumerGroup(queueName, this.name);
  }

  public async readFromConsumerGroup(
    params: ConsumerGroupReadInputPayload,
  ): Promise<LooseObject[]> {
    const { queueName = '', consumerName = '' } = params;
    return this.consumerGroupProvider.readFromConsumerGroup(queueName, this.name, consumerName);
  }

  public async ackMessageInConsumerGroup(
    params: AcknowledgeMessagePayload,
  ): Promise<void> {
    const { queueName = '', messageId = '' } = params;
    return this.consumerGroupProvider.ackMessageInConsumerGroup(queueName, this.name, messageId);
  }

  public getName(): string {
    return this.name;
  }
}
