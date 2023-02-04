import { RequestConsoleLogger } from '@studio/api-utils/middlewares';
import { NextFunction, Request, Response } from 'express';
import { Middleware, ExpressMiddlewareInterface } from 'routing-controllers';

@Middleware({ type: 'before' })
export class RequestConsoleLoggerMiddleware
  implements ExpressMiddlewareInterface
{
  use(request: Request, response: Response, next: NextFunction) {
    RequestConsoleLogger(request, response, next);
  }
}
