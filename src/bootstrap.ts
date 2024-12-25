import App from './app';
import { ApplicationOptions } from './helpers/types';

export default function bootstrap(): void {
  const applicationOpts: ApplicationOptions = {};
  /* eslint-disable no-new */
  new App(applicationOpts);
}

bootstrap();
