import { LoggerTypes } from '../../types';

export default abstract class AbstractLoggerProvider {
  abstract getLoggerInstance(): LoggerTypes;
}
