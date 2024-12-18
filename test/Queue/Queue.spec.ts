import dotenv from 'dotenv';
import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import chaiHttp from 'chai-http';
import Redis from 'ioredis';
import sinon from 'sinon';
import Logger from '../../src/logger/Logger';
import WinstonLogger from '../../src/logger/providers/WinstonLogger';
import RedisQueueProvider from '../../src/queue/providers/RedisQueueProvider';
import Queue from '../../src/queue/Queue';

dotenv.config();

chai.use(chaiHttp);
chai.use(chaiAsPromised);

let sinonSandbox: sinon.SinonSandbox;
let winstonLogger: WinstonLogger;
let logger: Logger;
let queueName: string;
let redisProvider: Redis;
let queueProvider: RedisQueueProvider;
let queue: Queue;

describe('Queue', () => {

  before(() => {
    queueName = 'testmsgq';
    winstonLogger = new WinstonLogger();
    logger = new Logger(winstonLogger);
    redisProvider = new Redis({
      port: +process.env.REDIS_PORT,
      host: process.env.REDIS_HOST,
    });
    queueProvider = new RedisQueueProvider(redisProvider, logger);
    queue = new Queue(queueName, queueProvider);
  });

  beforeEach(() => {
    sinonSandbox = sinon.createSandbox();
  });

  afterEach(() => {
    sinonSandbox.restore();
  });

  it('Queue: Pushing stream data into the Queue.', async () => {
    const promisArray = [];
    for (let i = 0; i < 100; i += 1) {
      let info = {
        idx: (i + 1),
      }
      promisArray.push(queue.addToQueue(info));
    }
    await Promise.all(promisArray);
  });

  it('Queue: Fetching data from Queue.', () => {

  });

});

