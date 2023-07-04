import 'reflect-metadata';
import { DependencyContainer } from '@studio/dependency-injection';
import { createExpressServer, useContainer } from 'routing-controllers';
import { authorizationChecker } from './auth/authorizationChecker';
import { currentUserChecker } from './auth/currentUserChecker';
import './mapping';
import './auth';

useContainer(DependencyContainer);

const app = createExpressServer({
  controllers: [`${__dirname}/controllers/**/*.{ts,js}`],
  middlewares: [`${__dirname}/middlewares/**/*.{ts,js}`],
  interceptors: [],
  defaultErrorHandler: false,
  authorizationChecker,
  currentUserChecker,
});

export { app };
