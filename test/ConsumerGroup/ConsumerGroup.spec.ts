import dotenv from 'dotenv';
import chai, { expect } from 'chai';
import chaiAsPromised from 'chai-as-promised';
import chaiHttp from 'chai-http';
import Redis from 'ioredis';
import sinon from 'sinon';
import RedisQueueProvider from '../../src/queue/providers/RedisQueueProvider';
import Queue from '../../src/queue/Queue';
import generateRandomName from '../../src/helpers/helper';
import RedisConsumerGroupProvider from '../../src/consumergroup/providers/RedisConsumerGroupProvider';
import ConsumerGroup from '../../src/consumergroup/ConsumerGroup';

dotenv.config();

chai.use(chaiHttp);
chai.use(chaiAsPromised);

let sinonSandbox: sinon.SinonSandbox;
let queueName: string;
let redisProvider: Redis;
let queueProvider: RedisQueueProvider;
let queue: Queue;
let consumerGroupFirst = 'consumerGroup1';
let consumerGroupSecond = 'consumerGroup2';
let consumerGroupProvider: RedisConsumerGroupProvider;
let consumerGroupOne: ConsumerGroup;
let consumerGroupTwo: ConsumerGroup;

describe('ConsumerGroup:', () => {

  before(async () => {

    // Creation of the queue.
    queueName = `queue_${generateRandomName()}`;
    redisProvider = new Redis({
      port: +process.env.REDIS_PORT,
      host: process.env.REDIS_HOST,
    });

    // Removing any existing streams with this name
    await redisProvider.del(queueName);

    queueProvider = new RedisQueueProvider(redisProvider);
    queue = new Queue(queueName, queueProvider);
    await queue.initialize();

    // Removing any existing streams with this name
    await redisProvider.del(queueName);

    // Adding some dummy value into the queue to create it on Redis
    await queue.addToQueue({ name: 'dummy payload' });




    // Creation of consumerGroup provider & consumerGroup
    consumerGroupProvider = new RedisConsumerGroupProvider(redisProvider);

    // Consumer Group class initialization
    consumerGroupOne = new ConsumerGroup(queue, consumerGroupProvider, consumerGroupFirst);
    consumerGroupTwo = new ConsumerGroup(queue, consumerGroupProvider, consumerGroupSecond);

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

  it('ConsumerGroup: Getting the name of the ConsumerGroup.', async () => {
    const firstConsumerGroupName = consumerGroupOne.getName();
    const secondConsumerGroupName = consumerGroupTwo.getName();
    expect(firstConsumerGroupName).to.equal(firstConsumerGroupName);
    expect(secondConsumerGroupName).to.equal(secondConsumerGroupName);
  });

  it('ConsumerGroup: Creation of ConsumerGroups.', async () => {

    const consumerGroupsBefore = await queue.getConsumerGroups();
    await consumerGroupOne.initialize();
    await consumerGroupTwo.initialize();
    const consumerGroupsAfter = await queue.getConsumerGroups();
    expect(consumerGroupsBefore?.length).to.equal(0);
    expect(consumerGroupsAfter?.length).to.equal(2);
  });

  it('ConsumerGroup: Deletion of ConsumerGroups.', async () => {
    const consumerGroupsBefore = await queue.getConsumerGroups();
    await consumerGroupOne.destroyConsumerGroup();
    await consumerGroupTwo.destroyConsumerGroup();
    const consumerGroupsAfter = await queue.getConsumerGroups();
    expect(consumerGroupsBefore?.length).to.equal(2);
    expect(consumerGroupsAfter?.length).to.equal(0);
  });

});
