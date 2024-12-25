import App from './app';
import { ApplicationOptions, MorganLoggingTypes } from './helpers/types';

export default function bootstrap(): void {
  const applicationOpts: ApplicationOptions = {
    morganConfig: {
      format: MorganLoggingTypes.COMBINED,
    },
  };
  /* eslint-disable no-new */
  new App(applicationOpts);
}

bootstrap();
