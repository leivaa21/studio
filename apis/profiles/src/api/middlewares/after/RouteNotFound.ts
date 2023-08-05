import { RouteNotFoundError } from '@studio/api-utils';
import { Request, Response } from 'express';
import { Middleware, ExpressMiddlewareInterface } from 'routing-controllers';

@Middleware({ priority: 1, type: 'after' })
export class RouteNotFoundMiddleware implements ExpressMiddlewareInterface {
  use(request: Request, response: Response) {
    if (!response.writableFinished) {
      throw new RouteNotFoundError(request.method, request.path);
    }
  }
}
