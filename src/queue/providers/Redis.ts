import { createClient, RedisClientType } from 'redis';
import AbstractQueueProvider from '../abstracts/AbstractQueueProvider';
import BaseError from '../../errors/base-error';
import ErrorTypes from '../../errors/error-types';
import Logger from '../../logger/Logger';

export default class Redis extends AbstractQueueProvider {
  private readonly redisUrl: string;

  private readonly logger: Logger;

  private redisClient: RedisClientType;

  constructor(redisUrl: string, logger: Logger) {
    super();
    this.redisUrl = redisUrl;
    this.logger = logger;
  }

  public async initialize(): Promise<void> | never {
    try {
      // eslint-disable-next-line @typescript-eslint/await-thenable
      this.redisClient = await createClient({ url: this.redisUrl });
      this.logger.info(`Redis connection establised successfully : ${this.redisUrl}`);
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : 'Unknown error occurred';
      this.logger.error(`${errorMessage}`);
      throw new BaseError(
        ErrorTypes.REDIS_CONNECTION_ERROR,
        errorMessage,
      );
    }
  }

  public getInstance(): RedisClientType {
    return this.redisClient;
  }
}
