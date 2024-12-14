/* eslint-disable no-await-in-loop */

import { AcknowledgeMessagePayload } from 'src/queue/types';
import { WorkerSubscriptionPayload } from './types';
import AbstractWorker from './abstracts/AbstractWorker';
import Queue from '../queue/Queue';
import { LooseObject } from '../types';

export default class Worker extends AbstractWorker {
  constructor(queue: Queue, consumerName = '') {
    super(queue, consumerName);
  }

  public async subscribe(params: WorkerSubscriptionPayload): Promise<void> {
    const { callback, consumerGroupName = '' } = params;
    while (true) {
      const result = await this.queue.readFromConsumerGroup({
        consumerGroupName,
        consumerName: this.consumerName,
      });

      let items: [string, [string]][] = [];
      if (
        result
        && Array.isArray(result)
        && result[0]
        && Array.isArray(result[0])
      ) {
        [[, items]] = result;
      }
      for (let i = 0; i < items?.length; i += 1) {
        const item = items[i];
        try {
          const [messageId = '', payloadInfo] = item;
          const [message] = payloadInfo;
          const parsedMessage = <LooseObject>(JSON.parse(message));
          const ackPayload: AcknowledgeMessagePayload = {
            consumerGroupName,
            messageId,
          };
          await callback(parsedMessage);
          await this.queue.ackMessageInGroup(ackPayload);
        } catch (e) {
          // failover queue logic
        }
      }
    }
  }
}
