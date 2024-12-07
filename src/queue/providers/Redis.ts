import Redis from 'ioredis';
import { LooseObject } from '../../types';
import AbstractQueueProvider from '../abstracts/AbstractQueueProvider';
import Logger from '../../logger/Logger';

export default class RedisProvider extends AbstractQueueProvider {
  private redisClient: any;

  constructor(logger: Logger) {
    super(logger);
    this.redisClient = new Redis({
      port: +process.env.REDIS_PORT,
      host: process.env.REDIS_HOST,
    });
  }

  public async add(queueName: string, payload: LooseObject): Promise<string> {
    const stringPayload = JSON.stringify(payload);
    // eslint-disable-next-line  @typescript-eslint/no-unsafe-call
    const id = <string>(await this.redisClient.xadd(queueName, '*', stringPayload, Math.random()));
    return id;
  }
}
