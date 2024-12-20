/* eslint-disable no-await-in-loop */

import { AcknowledgeMessagePayload } from '../consumergroup/types';
import { WorkerSubscriptionPayload } from './types';
import AbstractWorker from './abstracts/AbstractWorker';
import { LooseObject } from '../types';
import ConsumerGroup from '../consumergroup/ConsumerGroup';

export default class Worker extends AbstractWorker {
  constructor(
    consumerGroup: ConsumerGroup,
    consumerName = '',
  ) {
    super(
      consumerGroup,
      consumerName,
    );
  }

  public async subscribe(params: WorkerSubscriptionPayload): Promise<void | LooseObject[]> {
    const defaultFunc = (arg) => { console.log(arg); };
    const completionResultArr: LooseObject[] = [];
    const {
      callback = defaultFunc,
      count = +process.env.CONCURRENCY,
      breakOnCompletion = false,
      saveCompletionResult = false,
    } = params;

    while (true) {
      const result = await this.consumerGroup.readFromConsumerGroup({
        consumerName: this.consumerName,
        count,
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
      if (!items?.length && breakOnCompletion) return completionResultArr;
      for (let i = 0; i < items?.length; i += 1) {
        const item = items[i];
        try {
          const [messageId = '', payloadInfo] = item;
          const [message] = payloadInfo;
          const parsedMessage = <LooseObject>(JSON.parse(message));
          const ackPayload: AcknowledgeMessagePayload = {
            messageId,
          };
          const finalResult = await callback(parsedMessage);
          if (saveCompletionResult) completionResultArr.push({ result: finalResult });
          await this.consumerGroup.ackMessageInConsumerGroup(ackPayload);
        } catch (e) {
          // failover queue logic
        }
      }
    }
  }

  public getName(): string {
    return this.consumerName;
  }
}
