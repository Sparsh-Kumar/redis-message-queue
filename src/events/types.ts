import { LooseObject } from '../types';

export type AnyFunction = ((...args: any[]) => any);

export type EventOnPayload = {
  event: string;
  eventHandler: AnyFunction,
};

export type EventEmitPayload = {
  event: string;
  args: LooseObject[];
};

export type EventsInfo = {
  [key: string]: AnyFunction[],
};
