import { LooseObject } from '../types';

export type ConsumerGroupInfo = {
  groupName: string;
  consumers: number;
  pendingMessages: number;
  lastDeliveredId: string;
};

export type QueueAdditionPayload = LooseObject;

export type ConsumerGroupReadInputPayload = {
  consumerGroupName: string;
  consumerName: string;
};

export type AcknowledgeMessagePayload = {
  consumerGroupName: string;
  messageId: string;
};
