import Redis from 'ioredis';
import { LooseObject } from '../types';

export type QueueProvider = Redis;

export type QueueAdditionPayload = LooseObject;

export type ConsumerGroupInfo = {
  groupName: string;
  consumers: number;
  pendingMessages: number;
  lastDeliveredId: string;
};
