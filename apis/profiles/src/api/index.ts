import { createExpressServer } from 'routing-controllers';
import 'reflect-metadata';
import { info } from '@studio/api-utils/loggers/console';
import { EarlyMiddlewares, LateMiddlewares } from './middlewares';
import { Controllers } from './controllers';

const port = 3001;

const { NODE_ENV } = process.env;

createExpressServer({
  controllers: [...Controllers],
  middlewares: [...EarlyMiddlewares, ...LateMiddlewares],
  interceptors: [],
  defaultErrorHandler: false,
}).listen(port, () => {
  info(`Hey, running on http://localhost:${port} on env: ${NODE_ENV}`);
});
