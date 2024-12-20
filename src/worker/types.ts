import { LooseObject } from '../types';

export type CallBackFunction = (data: LooseObject) => Promise<LooseObject> | LooseObject;

export type WorkerSubscriptionPayload = {
  callback: CallBackFunction;
  breakOnCompletion?: boolean;
  saveCompletionResult?: boolean;
  count?: number;
  isFailOverWorker?: boolean;
};
