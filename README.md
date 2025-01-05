# Overview

## What is a Redis Message Queue?

The Redis Message Queue is a straightforward implementation of message queues, utilizing Redis streams as the message broker.

## Usage

## Message Producer Sample Code

```javascript
// This is how to produce the messages;
async function produceMessage() {

  // Creating & Initializing the Redis Message Queue
  const redisMessageQueue = new RedisMessageQueue({
    redisMessageQueueName: 'msgq',
    redisUrl: '',
    redisPort: 6379,
    failOverQueueHandling: false,
  });
  await redisMessageQueue.initializeQueue();

  // Produce the messages indefinitely
  let idx = 1;
  setInterval(async () => {
    await redisMessageQueue.produce({ data: idx });
    idx += 1;
  }, 1000);
}

async function main() {
  await produceMessage();
}

main()
```

## Message Consumer (Blocking Mode) Sample Code

```javascript
// This is how to consume the messages;
async function consumeMessage() {

  // Creating & Initializing the Redis Message Queue
  const redisMessageQueue = new RedisMessageQueue({
    redisMessageQueueName: 'msgq',
    redisUrl: '',
    redisPort: 6379,
    failOverQueueHandling: false,
  });
  await redisMessageQueue.initializeQueue();

  // Consume the messages indefinitely in blocking mode.
  redisMessageQueue.consume({
    consumerName: 'qconsumer',
    callback: function(value) {
      console.log(`The value is ${value}`);
    },
    count: 2,
  })
}

async function main() {
  await consumeMessage();
}

main()
```

## Why Choose Redis Streams?

When selecting a message queue, several factors must be considered, including:

- **Propagation:** Ensuring messages are disseminated effectively.
- **Delivery:** Guaranteeing reliable message delivery.
- **Persistence:** Maintaining message durability for fault tolerance.
- **Consumer Groups:** While implemented but not currently utilized, Consumer Groups can enable event-driven microservice architectures alongside message queue functionality.

## Propagation

Propagation refers to how messages are transferred by the message queue. There are two types of propagation:  

1. **One-to-One Propagation**  
   In this type, the producer sends a message to the queue, and the message is received by only one consumer. This approach ensures that each message is processed by a single recipient.

2. **One-to-Many Propagation (Fan-out)**  
   In this type, a single message from the producer can be delivered to multiple consumers. Although the producer sends only one message, it is propagated to many receivers. This behavior is commonly referred to as "fan-out."  

The distinction between these two types lies in how the message is distributed, which depends on the use case and the underlying architecture of the system.

![Message Propagation Methods](https://media2.dev.to/dynamic/image/width=800%2Cheight=%2Cfit=scale-down%2Cgravity=auto%2Cformat=auto/https%3A%2F%2Fdev-to-uploads.s3.amazonaws.com%2Fuploads%2Farticles%2F5fwrwguwgirwbrava543.png "Message Propagation Methods")


## Delivery

Delivery is a critical aspect of message queuing systems, and most systems provide specific delivery guarantees. The three most common delivery guarantees are:

1. **At-Most-Once**  
   This guarantee ensures that a message is delivered at most one time. It is relatively easy to achieve and is supported by all queuing systems. In this case, the consumer may either receive the message or not receive it at all. This behavior can occur under several circumstances:  
   - The message is lost due to network issues.  
   - The consumer receives the message but fails to process it properly, such as when it crashes.  
   If the message is lost, it cannot be retrieved again, making this the least reliable guarantee.

2. **At-Least-Once**  
   This guarantee ensures that every message is processed, but it may result in a message being processed multiple times. Well-known systems such as RabbitMQ and Kafka often provide this level of guarantee. For example, if a consumer does not acknowledge the queue that the message has been processed, the queue will resend the message. While this approach ensures message delivery, it requires additional handling to manage duplicate messages.

3. **Exactly-Once**  
   This is the strictest and most reliable delivery guarantee. It ensures that each message is processed exactly once. However, achieving this guarantee is challenging and often comes with a trade-off in performance. Even popular systems like RabbitMQ struggle to implement this guarantee consistently. Kafka, on the other hand, can achieve exactly-once delivery with proper configuration and usage, though it requires sacrificing some performance.  

Each delivery guarantee serves different use cases, and the choice depends on the application's requirements and tolerance for duplication or loss.

## Persistence  

Persistence refers to whether a message remains in the system after being sent. There are three main types of persistence:  

1. **In-Memory**  
   In this type, messages are stored in memory only, making access and processing extremely fast. However, the drawback is that messages are lost if the system crashes or restarts, as there is no backup on disk.

2. **In-Disk**  
   Here, messages are written directly to disk, ensuring durability even in the event of a system failure. Contrary to common belief, persisting messages on disk does not always result in slower performance. The implementation plays a critical role. For instance:  
   - **Kafka** utilizes a Log-Structured Merge Tree (LSM-tree) to achieve high throughput, offering better performance than systems like RabbitMQ that primarily rely on memory.  
   - Similarly, **Cassandra**, known for its rapid write speeds, also uses LSM-tree for efficient disk operations.

3. **Hybrid**  
   The hybrid approach combines the strengths of in-memory and in-disk persistence. To optimize write performance, messages are initially written to memory and then flushed to disk. **RabbitMQ** is a well-known example of a hybrid system, as it writes messages to memory first for speed but eventually stores them on disk for durability. Notably, RabbitMQ can also be configured to operate entirely as an in-disk system if required.  

The choice of persistence type depends on the system's requirements for performance, durability, and fault tolerance, as well as the specific implementation of the queuing system.

## Consumer Groups  

In my opinion, consumer groups are the most crucial feature of a queuing system. Processing messages often takes time, which necessitates the use of multiple consumers to handle them, enabling what is commonly referred to as **scale-out**.  

In scenarios involving consumer groups, the targets for both **one-to-one** and **one-to-many** propagation change from a single consumer to a group of consumers.  

- **One-to-One with Consumer Groups:** A single message is consumed by only one member of the group. This ensures load balancing, as each message is processed by a different consumer within the group.  
- **One-to-Many with Consumer Groups:** All members of the group receive the same message, enabling parallel processing of the same data by multiple consumers.  

This approach allows systems to distribute workloads efficiently and scale horizontally, ensuring higher throughput and better resource utilization.

![Consumer Groups](https://media2.dev.to/dynamic/image/width=800%2Cheight=%2Cfit=scale-down%2Cgravity=auto%2Cformat=auto/https%3A%2F%2Fdev-to-uploads.s3.amazonaws.com%2Fuploads%2Farticles%2Ftqt3ba1af71mniqcmdf3.png "Consumer Groups")

## Redis Queue

After talking about the properties in a queuing system, let's talk about how Redis be a message queue. There are 3 ways to do it,

- Pub/Sub
- List
- Stream
  
We will introduce one by one, and then give a comprehensive summary.

## Pub/Sub  

![Pub Sub](https://media2.dev.to/dynamic/image/width=800%2Cheight=%2Cfit=scale-down%2Cgravity=auto%2Cformat=auto/https%3A%2F%2Fdev-to-uploads.s3.amazonaws.com%2Fuploads%2Farticles%2Fujad5nqivupxwkhsf6x6.png "Pub Sub")

**Pub/Sub** (Publish/Subscribe) is a well-known messaging pattern for notification systems. This feature emerged almost simultaneously with Redis. In this model:  
- Consumers **SUBSCRIBE** to a topic (a key in Redis).  
- Producers **PUBLISH** messages to the same topic.  
- The subscribed consumers receive the data in real-time.  

As a traditional Pub/Sub feature, Redis Pub/Sub also supports **fan-out**, allowing a single message to be delivered to multiple consumers. Additionally, a certain degree of message routing can be achieved using the **PSUBSCRIBE** command, which enables pattern-based subscriptions.  

## Limitations of Redis Pub/Sub  
Despite its simplicity, Redis Pub/Sub is not widely adopted for most use cases due to its inherent limitations:  
1. **At-Most-Once Delivery:**  
   - Messages are delivered only if the consumer is active and ready to receive them at the time of publishing.  
   - If the consumer is offline or unavailable, the message is lost.  

2. **Lack of Persistence:**  
   - Redis Pub/Sub does not persist messages.  
   - All messages are ephemeral and are lost if Redis shuts down or restarts.  

3. **No Consumer Groups:**  
   - Redis Pub/Sub does not support consumer groups, which limits its scalability for processing workloads across multiple consumers.  

### Summary of Redis Pub/Sub Features:  
- **Propagation:** Supports both **1-to-1** and **1-to-many** communication.  
- **Delivery Guarantee:** At-most-once.  
- **Persistence:** None (messages are not stored).  
- **Consumer Groups:** Not supported.  

These limitations make Redis Pub/Sub suitable for real-time, transient notification systems but less ideal for scenarios requiring message durability or robust delivery guarantees.

## List  

![List](https://media2.dev.to/dynamic/image/width=800%2Cheight=%2Cfit=scale-down%2Cgravity=auto%2Cformat=auto/https%3A%2F%2Fdev-to-uploads.s3.amazonaws.com%2Fuploads%2Farticles%2F8a7czjtd4ikvktir13oc.png "List")

The **List** data structure in Redis is a versatile tool that can easily implement a FIFO (First-In-First-Out) queue. The key feature of using Redis Lists for queuing is the ability to use the `BLPOP` command, which allows consumers to wait for messages in a **blocking mode**. To prevent indefinite blocking, it is recommended to set a timeout when using `BLPOP`.  

## Key Features:  
1. **Implicit Consumer Group Formation:**  
   - If multiple consumers simultaneously use `BLPOP` to wait for messages on the same list, they effectively form a consumer group without any explicit configuration.  
   - Each message is delivered to only one consumer in the group, achieving a load-balancing effect.  

2. **No Fan-Out Capability:**  
   - Redis Lists do not support message fan-out.  
   - Once a message is retrieved by one consumer via `BLPOP`, it is no longer available to others, even if the message is lost by that consumer.  

3. **Message Persistence:**  
   - Messages in a Redis List are persisted in memory.  
   - If **Append-Only File (AOF)** or **Redis Data Backup (RDB)** is enabled, messages can also be backed up to disk.  
   - However, this approach is not entirely reliable for true data persistence, as backups are dependent on periodic snapshots or append operations.  

## Summary of Redis List Features:  
- **Propagation:** Supports **1-to-1** communication but not **1-to-many**.  
- **Delivery Guarantee:** At-most-once (messages are lost if a consumer fails).  
- **Persistence:** In-memory with optional disk backups using AOF or RDB.  
- **Consumer Groups:** Supported implicitly when multiple consumers use `BLPOP` on the same list.  

Redis Lists provide a simple and effective way to implement a queue, especially for systems that prioritize simplicity and lightweight operations. However, the lack of fan-out and stronger persistence guarantees may limit their use in more complex messaging scenarios.

## Stream  

After discussing **Pub/Sub** and **List**, it's evident that neither fully addresses all messaging system requirements due to their respective limitations. Recognizing these shortcomings, **Stream** was introduced in Redis 5.0 to provide a more robust solution.  

Streams are a more advanced data structure designed to address the issues in **Pub/Sub** and **List**, offering enhanced functionality and reliability.  

## Key Features and Benefits of Redis Streams:  

1. **1-to-1 and 1-to-Many Propagation:**  
   - Streams handle both **1-to-1** and **1-to-many** communication scenarios effectively.  

2. **At-Least-Once Delivery:**  
   - Streams support **at-least-once** delivery, ensuring that every message is processed, even if it means resending the message if the consumer does not acknowledge it.  

3. **Persistence:**  
   - Messages in Streams are persisted in memory.  
   - With **Append-Only File (AOF)** or **Redis Data Backup (RDB)** enabled, messages can also be backed up to disk, providing a degree of durability.  

4. **Consumer Groups:**  
   - Streams natively support **consumer groups**, allowing multiple consumers to collaborate efficiently in processing messages.  
   - This feature makes it easy to scale out processing workloads without requiring complex configurations.  

![Stream](https://media2.dev.to/dynamic/image/width=800%2Cheight=%2Cfit=scale-down%2Cgravity=auto%2Cformat=auto/https%3A%2F%2Fdev-to-uploads.s3.amazonaws.com%2Fuploads%2Farticles%2Filb8q8g5dzon3k9ys1uh.png "Stream")

## Why Choose Streams?  
Streams solve the issues present in **Pub/Sub** and **List** by offering features like **at-least-once delivery** and native support for **consumer groups**. These enhancements make Streams a powerful and reliable tool for building messaging systems.  

## Summary of Redis Stream Features:  
- **Propagation:** Supports both **1-to-1** and **1-to-many** scenarios.  
- **Delivery Guarantee:** At-least-once.  
- **Persistence:** In-memory with optional disk backups via AOF or RDB.  
- **Consumer Groups:** Fully supported.  

Redis Streams address the limitations of previous methods and provide a more feature-rich solution for modern messaging systems.

## Stream and Consumer Groups  

In addition to supporting **one-to-one** mapping, Redis Streams also natively support **consumer groups**, enabling efficient workload distribution among multiple consumers.  

## Consumer Group Functionality  

With consumer groups, multiple consumers can collaborate to process messages from the same stream. Each consumer in the group is assigned specific messages, ensuring no duplication of work.  

![Streams Consumer Groups](https://media2.dev.to/dynamic/image/width=800%2Cheight=%2Cfit=scale-down%2Cgravity=auto%2Cformat=auto/https%3A%2F%2Fdev-to-uploads.s3.amazonaws.com%2Fuploads%2Farticles%2Febx3ukbbc59u2yrhshl6.png "Streams Consumer Groups")

## Achieving At-Least-Once Delivery  

To ensure the **at-least-once** delivery guarantee, Redis Streams require consumers to explicitly acknowledge messages after processing them. This is done using the `XACK` command. If a message is not acknowledged, Redis can reassign it to another consumer, ensuring that the message is eventually processed.  

## Advantages of Stream with Consumer Groups  
- **Scalability:** Multiple consumers can process messages concurrently.  
- **Reliability:** Messages are not lost, as unacknowledged messages can be reassigned.  
- **Efficiency:** Ensures proper load balancing across the group.  

Redis Streams, with their consumer group support and acknowledgment mechanisms, provide a robust and reliable foundation for scalable and fault-tolerant messaging systems.

## Contributing

Contributions are welcome! Feel free to open issues or pull requests for improvements or bug fixes.

## License

This project is licensed under the MIT License - see the [LICENSE](https://github.com/Sparsh-Kumar/backtesting.py/blob/main/LICENSE) file for details

