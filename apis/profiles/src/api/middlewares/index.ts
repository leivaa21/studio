import { CustomErrorHandler } from './after/ErrorHandler';
import { RouteNotFoundMiddleware } from './after/RouteNotFound';
import { RequestConsoleLoggerMiddleware } from './before/RequestConsoleLogger';

const EarlyMiddlewares = [RequestConsoleLoggerMiddleware];
const LateMiddlewares = [CustomErrorHandler, RouteNotFoundMiddleware];

export { EarlyMiddlewares, LateMiddlewares };
