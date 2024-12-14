import dotenv from 'dotenv';
import Logger from './logger/Logger';
import WinstonLogger from './logger/providers/WinstonLogger';

dotenv.config();

const bootstrap = async () => {
  const winstonLogger = new WinstonLogger();
  const logger = new Logger(winstonLogger);
  await new Promise((resolve, reject) => {
    console.log(logger);
    resolve({});
  });
};

bootstrap().then(() => { }).catch(() => { });
