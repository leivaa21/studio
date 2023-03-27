import { RouteNotFound } from '@studio/api-utils/exceptions';
import { Injectable } from '@studio/dependency-injection';
import { Request, Response } from 'express';
import { Middleware, ExpressMiddlewareInterface } from 'routing-controllers';
@Injectable()
@Middleware({ priority: 1, type: 'after' })
export class RouteNotFoundMiddleware implements ExpressMiddlewareInterface {
  use(request: Request, response: Response) {
    if (!response.writableFinished) {
      throw new RouteNotFound(request.method, request.path);
    }
  }
}
