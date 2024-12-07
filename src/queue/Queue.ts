import { LooseObject } from '../types';
import AbstractQueueProvider from './abstracts/AbstractQueueProvider';

export default class Queue {
  private readonly name: string;

  private readonly queueProvider: AbstractQueueProvider;

  constructor(name: string, queueProvider: AbstractQueueProvider) {
    this.name = name;
    this.queueProvider = queueProvider;
  }

  public async add(payload: LooseObject): Promise<string> {
    return this.queueProvider.add(this.name, payload);
  }
}
