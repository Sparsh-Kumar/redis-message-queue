import dotenv from 'dotenv';
import chai, { expect } from 'chai';
import chaiAsPromised from 'chai-as-promised';
import chaiHttp from 'chai-http';
import Redis from 'ioredis';
import sinon from 'sinon';
import Logger from '../../src/logger/Logger';
import WinstonLogger from '../../src/logger/providers/WinstonLogger';
import RedisQueueProvider from '../../src/queue/providers/RedisQueueProvider';
import Queue from '../../src/queue/Queue';
import generateRandomName from '../Helpers/Helper';

dotenv.config();

chai.use(chaiHttp);
chai.use(chaiAsPromised);

let sinonSandbox: sinon.SinonSandbox;
let winstonLogger: WinstonLogger;
let logger: Logger;
let queueName: string;
let queueNameForDeletion: string;
let redisProvider: Redis;
let queueProvider: RedisQueueProvider;
let queue: Queue;
let queueForDeletion: Queue;
let numberOfRecords = 100;

describe('Queue:', () => {

  before(async () => {
    queueName = `queue_${generateRandomName()}`;
    queueNameForDeletion = `queue_${generateRandomName()}`;
    winstonLogger = new WinstonLogger();
    logger = new Logger(winstonLogger);
    redisProvider = new Redis({
      port: +process.env.REDIS_PORT,
      host: process.env.REDIS_HOST,
    });
    queueProvider = new RedisQueueProvider(redisProvider, logger);
    queue = new Queue(queueName, queueProvider);

    // Adding some value in the queueForDeletion, so that it gets initiated in Redis
    // We will just use this queue for testing the delete functionality.
    queueForDeletion = new Queue(queueNameForDeletion, queueProvider);
    await redisProvider.xadd(queueNameForDeletion, '*', JSON.stringify({ counter: 1 }), Math.random());

    // Removing any existing streams with this name
    await redisProvider.del(queueName);
  });

  beforeEach(() => {
    sinonSandbox = sinon.createSandbox();
  });

  afterEach(() => {
    sinonSandbox.restore();
  });

  after(async () => {
    // Removing the queue after performing all our tests
    await redisProvider.del(queueName);
  });

  it('Queue: Getting the name of the Queue.', async () => {
    const name = queue.getName();
    expect(name).to.equal(queueName);
  });

  it('Queue: Pushing stream data into the Queue.', async () => {
    const promisArray = [];
    for (let i = 0; i < numberOfRecords; i += 1) {
      let info = {
        idx: (i + 1),
      }
      promisArray.push(queue.addToQueue(info));
    }
    const resp = await Promise.all(promisArray);
    expect(resp.length).to.equal(100);
  });

  it('Queue: Fetching data from Queue.', async () => {
    const allRecords = await queue.fetchAllRecords();
    expect(allRecords?.length || 0).to.equal(numberOfRecords);
  });

  it('Queue: Deleting the Queue.', async () => {
    const existsBefore = await redisProvider.exists(queueNameForDeletion);
    await queueForDeletion.deleteQueue();
    const existsAfter = await redisProvider.exists(queueNameForDeletion);
    expect(!!existsBefore).to.equal(true);
    expect(!!existsAfter).to.equal(false);
  })
});

