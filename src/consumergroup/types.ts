import Redis from 'ioredis';

export type ConsumerGroupProvider = Redis;

export type CreateConsumerGroupPayload = {
  queueName: string;
};

export type ConsumerGroupReadInputPayload = {
  queueName: string;
  consumerName: string;
};

export type AcknowledgeMessagePayload = {
  queueName: string;
  messageId: string;
};
