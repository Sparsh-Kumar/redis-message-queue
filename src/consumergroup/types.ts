import Redis from 'ioredis';

export type ConsumerGroupProvider = Redis;

export type CreateConsumerGroupPayload = {
  queueName: string;
};

export type ConsumerGroupReadInputPayload = {
  consumerName: string;
  count?: number;
};

export type AcknowledgeMessagePayload = {
  messageId: string;
};
