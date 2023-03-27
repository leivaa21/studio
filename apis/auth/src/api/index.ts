import './mapping';
import { configMongoose, connectToMongo } from './mongo/connection';
import { createExpressServer } from 'routing-controllers';
import 'reflect-metadata';
import { info } from '@studio/api-utils/loggers/console';
import { authorizationChecker } from './auth/authorizationChecker';
import { currentUserChecker } from './auth/currentUserChecker';
import './auth';

configMongoose();
connectToMongo();

const port = 5000;

const { NODE_ENV } = process.env;

createExpressServer({
  controllers: [`${__dirname}/controllers/**/*.{ts,js}`],
  middlewares: [`${__dirname}/middlewares/**/*.{ts,js}`],
  interceptors: [],
  defaultErrorHandler: false,
  authorizationChecker: authorizationChecker,
  currentUserChecker: currentUserChecker,
}).listen(port, () => {
  info(`Hey, running on http://localhost:${port} on env: ${NODE_ENV}`);
});
