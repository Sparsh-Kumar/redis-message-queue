import { ApplicationOptions } from './types';

export default abstract class AbstractApplication {
  protected readonly options: ApplicationOptions;

  constructor(options: ApplicationOptions) {
    this.options = options;
    this.setup();
  }
  abstract setup(): void;
}
