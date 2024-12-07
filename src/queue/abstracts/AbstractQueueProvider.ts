import { QueueManagerType } from '../../types';

export default abstract class AbstractQueueManager {
  abstract initialize(): Promise<void> | never;
  abstract getInstance(): QueueManagerType;
}
