import { createExpressServer, useContainer } from 'routing-controllers';
import 'reflect-metadata';
import { DependencyContainer } from '@studio/dependency-injection';

useContainer(DependencyContainer);

const app = createExpressServer({
  controllers: [`${__dirname}/controllers/**/*.{ts,js}`],
  middlewares: [`${__dirname}/middlewares/**/*.{ts,js}`],
  interceptors: [],
  defaultErrorHandler: false,
});

export { app };
