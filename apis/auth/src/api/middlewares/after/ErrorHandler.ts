import { ErrorHandler } from '@studio/api-utils';
import { Injectable } from '@studio/dependency-injection';
import { NextFunction, Request, Response } from 'express';
import {
  Middleware,
  ExpressErrorMiddlewareInterface,
} from 'routing-controllers';

@Injectable()
@Middleware({ priority: 0, type: 'after' })
export class CustomErrorHandler implements ExpressErrorMiddlewareInterface {
  error(
    error: Error,
    request: Request,
    response: Response,
    next: NextFunction
  ) {
    ErrorHandler(error, request, response, next);
  }
}
