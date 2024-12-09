import AbstractQueueProvider from '../../queue/abstracts/AbstractQueueProvider';

export default abstract class AbstractWorker {
  private readonly queue: AbstractQueueProvider;

  constructor(queue: AbstractQueueProvider) {
    this.queue = queue;
  }
}
