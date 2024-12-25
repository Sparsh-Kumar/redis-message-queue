import {
  QueueAdditionPayload,
} from './types';
import AbstractQueueProvider from './abstracts/AbstractQueueProvider';
import EventEmitter from '../events/emitter';
import { LooseObject } from '../types';
import Events from '../events/events';

export default class Queue {
  private readonly name: string;

  private readonly queueProvider: AbstractQueueProvider;

  private readonly eventEmitter: EventEmitter;

  constructor(
    name: string,
    queueProvider: AbstractQueueProvider,
    eventEmitter: EventEmitter,
  ) {
    this.name = name;
    this.queueProvider = queueProvider;
    this.eventEmitter = eventEmitter;
    this.eventEmitter.on({
      event: Events.ADD_TO_QUEUE,
      eventHandler: this.addToQueue.bind(this),
    });
    this.eventEmitter.on({
      event: Events.FETCH_ALL_RECORDS,
      eventHandler: this.fetchAllRecords.bind(this),
    });
    this.eventEmitter.on({
      event: Events.DELETE_QUEUE,
      eventHandler: this.deleteQueue.bind(this),
    });
    this.eventEmitter.on({
      event: Events.GET_CONSUMER_GROUPS,
      eventHandler: this.getConsumerGroups.bind(this),
    });
  }

  public async addToQueue(params: QueueAdditionPayload): Promise<string> {
    const val = await this.queueProvider.addToQueue(this.name, params);
    this.eventEmitter.emit({
      event: Events.ADDED_TO_QUEUE,
      args: [{
        count: 1,
      }],
    });
    return val;
  }

  public async fetchAllRecords(): Promise<LooseObject> {
    return this.queueProvider.fetchAllRecords(this.name);
  }

  public async deleteQueue(): Promise<void> {
    return this.queueProvider.deleteQueue(this.name);
  }

  public async getConsumerGroups(): Promise<LooseObject> {
    return (this.queueProvider.getConsumerGroups(this.name));
  }

  public getName(): string {
    return this.name;
  }
}
