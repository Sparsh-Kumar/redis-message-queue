import express from 'express';
import { ApplicationOptions } from './types';

export default abstract class AbstractApplication {
  protected app: express.Application;

  protected readonly options: ApplicationOptions;

  constructor(options: ApplicationOptions) {
    this.options = options;
    this.setup();
  }
  abstract setup(): void;
}
