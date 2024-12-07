import Logger from '../../logger/Logger';
import { LooseObject } from '../../types';

export default abstract class AbstractQueueProvider {
  protected readonly logger: Logger;

  constructor(logger: Logger) {
    this.logger = logger;
  }
  abstract add(queueName: string, payload: LooseObject): Promise<string>;
}
