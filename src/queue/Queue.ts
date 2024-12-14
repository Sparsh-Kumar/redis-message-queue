import { LooseObject } from '../types';
import {
  AcknowledgeMessagePayload, ConsumerGroupInfo, ConsumerGroupReadInputPayload, QueueAdditionPayload,
} from './types';
import AbstractQueueProvider from './abstracts/AbstractQueueProvider';

export default class Queue {
  private readonly name: string;

  private readonly queueProvider: AbstractQueueProvider;

  constructor(name: string, queueProvider: AbstractQueueProvider) {
    this.name = name;
    this.queueProvider = queueProvider;
  }

  public async addToQueue(params: QueueAdditionPayload): Promise<string> {
    return this.queueProvider.addToQueue(this.name, params);
  }

  public async createConsumerGroup(): Promise<string> {
    return this.queueProvider.createConsumerGroup(this.name);
  }

  public async getConsumerGroupsInfo(): Promise<ConsumerGroupInfo[]> {
    const consumerGroupsInfo = await this.queueProvider.consumerGroupInfo(this.name);
    return consumerGroupsInfo;
  }

  public async readFromConsumerGroup(
    params: ConsumerGroupReadInputPayload,
  ): Promise<LooseObject[]> {
    const { consumerGroupName = '', consumerName = '' } = params;
    return this.queueProvider.readFromConsumerGroup(this.name, consumerGroupName, consumerName);
  }

  public async ackMessageInGroup(
    params: AcknowledgeMessagePayload,
  ): Promise<void> {
    const { consumerGroupName = '', messageId = '' } = params;
    return this.queueProvider.ackMessageInGroup(this.name, consumerGroupName, messageId);
  }
}
