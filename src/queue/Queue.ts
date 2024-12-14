import {
  QueueAdditionPayload,
} from './types';
import AbstractQueueProvider from './abstracts/AbstractQueueProvider';

export default class Queue {
  private readonly name: string;

  private readonly queueProvider: AbstractQueueProvider;

  constructor(
    name: string,
    queueProvider: AbstractQueueProvider,
  ) {
    this.name = name;
    this.queueProvider = queueProvider;
  }

  public async addToQueue(params: QueueAdditionPayload): Promise<string> {
    return this.queueProvider.addToQueue(this.name, params);
  }

  public getName(): string {
    return this.name;
  }
}
