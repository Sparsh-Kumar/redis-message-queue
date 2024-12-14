import { LooseObject } from '../types';

export type CallBackFunction = (data: LooseObject) => Promise<LooseObject> | LooseObject;

export type WorkerSubscriptionPayload = {
  callback: CallBackFunction;
  consumerGroupName: string;
};
