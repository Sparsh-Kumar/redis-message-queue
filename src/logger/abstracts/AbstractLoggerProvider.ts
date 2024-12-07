export default abstract class AbstractLoggerProvider {
  abstract info(msg: string): void;
  abstract warn(msg: string): void;
  abstract debug(msg: string): void;
  abstract error(msg: string): void;
}
