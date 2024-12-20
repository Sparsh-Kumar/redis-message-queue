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
import RedisConsumerGroupProvider from '../../src/consumergroup/providers/RedisConsumerGroupProvider';
import ConsumerGroup from '../../src/consumergroup/ConsumerGroup';
import { CallBackFunction } from '../../src/worker/types';
import Worker from '../../src/worker/Worker';
import { LooseObject } from '../../src/types';

dotenv.config();

chai.use(chaiHttp);
chai.use(chaiAsPromised);

let sinonSandbox: sinon.SinonSandbox;
let winstonLogger: WinstonLogger;
let logger: Logger;
let queueName: string;
let failOverQueueName: string;
let redisProvider: Redis;
let queueProvider: RedisQueueProvider;
let queue: Queue;
let failOverQueue: Queue;
let consumerGroupFirst = 'consumerGroup1';
let consumerGroupSecond = 'consumerGroup2';
let consumerGroupProvider: RedisConsumerGroupProvider;
let consumerGroupOne: ConsumerGroup;
let consumerGroupTwo: ConsumerGroup;
let workerOneConsumerGroupOneName = 'worker1group1';
let workerTwoConsumerGroupOneName = 'worker2group1';
let workerOneConsumerGroupTwoName = 'worker1group2';
let workerOneConsumerGroupOne: Worker;
let workerTwoConsumerGroupOne: Worker;
let workerOneConsumerGroupTwo: Worker;
let messageCounts = 10;
let count = 5;

let defaultFunction: CallBackFunction = (arg) => {
  const { idx } = arg;
  let val = 2 * (+idx);
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ idx, val });
    });
  })
};

describe('Worker:', () => {

  before(async () => {

    // Creation of the queue.
    queueName = `queue_${generateRandomName()}`;
    failOverQueueName = `failover_${queueName}`;
    winstonLogger = new WinstonLogger();
    logger = new Logger(winstonLogger);
    redisProvider = new Redis({
      port: +process.env.REDIS_PORT,
      host: process.env.REDIS_HOST,
    });
    queueProvider = new RedisQueueProvider(redisProvider, logger);
    queue = new Queue(queueName, queueProvider);
    failOverQueue = new Queue(failOverQueueName, queueProvider);

    // Removing any existing streams with this name
    await redisProvider.del(queueName);

    // Adding values into the queue
    for (let i = 0; i < messageCounts; i += 1) {
      await queue.addToQueue({ idx: (i + 1) });
    }

    // Creation of consumerGroup provider & consumerGroup
    consumerGroupProvider = new RedisConsumerGroupProvider(redisProvider, logger);

    // Consumer Group class initialization
    consumerGroupOne = new ConsumerGroup(queue, consumerGroupProvider, consumerGroupFirst);
    await consumerGroupOne.initialize();
    consumerGroupTwo = new ConsumerGroup(queue, consumerGroupProvider, consumerGroupSecond);
    await consumerGroupTwo.initialize();

    // Creation of worker instances for consumer group one.
    workerOneConsumerGroupOne = new Worker(failOverQueue, consumerGroupOne, workerOneConsumerGroupOneName);
    workerTwoConsumerGroupOne = new Worker(failOverQueue, consumerGroupOne, workerTwoConsumerGroupOneName);

    // Creation of worker instances for consumer group two.
    workerOneConsumerGroupTwo = new Worker(failOverQueue, consumerGroupTwo, workerOneConsumerGroupTwoName);

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

  it('Worker: Getting the name of the Worker.', async () => {
    expect(workerOneConsumerGroupOne.getName()).to.equal(workerOneConsumerGroupOneName);
    expect(workerTwoConsumerGroupOne.getName()).to.equal(workerTwoConsumerGroupOneName);
    expect(workerOneConsumerGroupTwo.getName()).to.equal(workerOneConsumerGroupTwoName);
  });

  it(`Worker: Workers 1 & 2 in consumer group 1 should consume ${count} values each. Also they should consume different values from the queue.`, async () => {

    const distinctIdx = new Set();
    const distinctVal = new Set();

    const workerOneConsumerGroupOnePromise = workerOneConsumerGroupOne.subscribe({
      callback: defaultFunction,
      breakOnCompletion: true,
      saveCompletionResult: true,
      count: 5,
    });

    const workerTwoConsumerGroupOnePromise = workerTwoConsumerGroupOne.subscribe({
      callback: defaultFunction,
      breakOnCompletion: true,
      saveCompletionResult: true,
      count: 5
    });

    const [workerOneConsumerGroupOneResult, workerTwoConsumerGroupOneResult] = await Promise.all(
      [
        workerOneConsumerGroupOnePromise,
        workerTwoConsumerGroupOnePromise,
      ]
    );

    for (let i = 0; i < (<LooseObject[]>workerOneConsumerGroupOneResult)?.length; i += 1) {
      const { result = {} } = workerOneConsumerGroupOneResult[i];
      const { idx, val } = result;
      distinctIdx.add(idx);
      distinctVal.add(val);
    }

    for (let i = 0; i < (<LooseObject[]>workerTwoConsumerGroupOneResult)?.length; i += 1) {
      const { result = {} } = workerTwoConsumerGroupOneResult[i];
      const { idx, val } = result;
      distinctIdx.add(idx);
      distinctVal.add(val);
    }

    expect((<LooseObject[]>workerOneConsumerGroupOneResult)?.length).to.equal(5);
    expect((<LooseObject[]>workerTwoConsumerGroupOneResult)?.length).to.equal(5);
    expect(Array.from(distinctIdx)?.length).to.equal(messageCounts);
    expect(Array.from(distinctVal)?.length).to.equal(messageCounts);
  });

  it(`Worker: Worker 1 in consumer group 2 should consume all ${messageCounts} values. Because it is in separate consumer group.`, async () => {

    const distinctIdx = new Set();
    const distinctVal = new Set();

    const workerOneConsumerGroupTwoResult = await workerOneConsumerGroupTwo.subscribe({
      callback: defaultFunction,
      breakOnCompletion: true,
      saveCompletionResult: true,
      count: +process.env.CONCURRENCY,
    });

    for (let i = 0; i < (<LooseObject[]>workerOneConsumerGroupTwoResult)?.length; i += 1) {
      const { result = {} } = workerOneConsumerGroupTwoResult[i];
      const { idx, val } = result;
      distinctIdx.add(idx);
      distinctVal.add(val);
    }

    expect((<LooseObject[]>workerOneConsumerGroupTwoResult)?.length).to.equal(messageCounts);
    expect(Array.from(distinctIdx)?.length).to.equal(messageCounts);
    expect(Array.from(distinctVal)?.length).to.equal(messageCounts);
  })
});

