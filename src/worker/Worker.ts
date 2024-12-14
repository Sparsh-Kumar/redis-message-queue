/* eslint-disable no-await-in-loop */

import { AcknowledgeMessagePayload } from '../consumergroup/types';
import { WorkerSubscriptionPayload } from './types';
import AbstractWorker from './abstracts/AbstractWorker';
import Queue from '../queue/Queue';
import { LooseObject } from '../types';
import ConsumerGroup from '../consumergroup/ConsumerGroup';

export default class Worker extends AbstractWorker {
  constructor(
    queue: Queue,
    consumerGroup: ConsumerGroup,
    consumerName = '',
  ) {
    super(
      queue,
      consumerGroup,
      consumerName,
    );
  }

  public async subscribe(params: WorkerSubscriptionPayload): Promise<void> {
    const defaultFunc = (arg) => { console.log(arg); };
    const { callback = defaultFunc } = params;
    const queueName = this.queue.getName();

    while (true) {
      const result = await this.consumerGroup.readFromConsumerGroup({
        queueName,
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
            queueName,
            messageId,
          };
          await callback(parsedMessage);
          await this.consumerGroup.ackMessageInConsumerGroup(ackPayload);
        } catch (e) {
          // failover queue logic
        }
      }
    }
  }
}
