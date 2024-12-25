import { LooseObject } from '../types';

export enum MorganLoggingTypes {
  DEV = 'dev',
  COMBINED = 'combined',
  COMMON = 'common',
  TINY = 'tiny',
  SHORT = 'short',
}

export type MorganConfig = {
  format: MorganLoggingTypes,
  options?: LooseObject,
};

export type ApplicationOptions = {
  morganConfig: MorganConfig;
};
