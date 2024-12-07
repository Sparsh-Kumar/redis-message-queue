import dotenv from 'dotenv';
import Logger from './logger/Logger';
import WinstonLogger from './logger/providers/WinstonLogger';

import Queue from './queue/Queue';
import RedisProvider from './queue/providers/Redis';

dotenv.config();

const bootstrap = async () => {
  const winstonLogger = new WinstonLogger();
  const logger = new Logger(winstonLogger);

  const redisProvider = new RedisProvider(logger);
  const queue = new Queue('msgq', redisProvider);

  const payload = {
    name: 'Sparsh Kumar',
    age: 28,
  };

  await queue.add(payload);
};

bootstrap().then(() => { }).catch(() => { });
