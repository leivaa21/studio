import { StatusCode } from '@studio/api-utils/http';
import { ErrorHandler } from '@studio/api-utils/middlewares';
import { NextFunction, Request, Response } from 'express';
import {
  Middleware,
  ExpressErrorMiddlewareInterface,
} from 'routing-controllers';
import { Exception } from '../../../contexts/shared/domain/exceptions/Exception';

@Middleware({ priority: 0, type: 'after' })
export class CustomErrorHandler implements ExpressErrorMiddlewareInterface {
  error(
    error: Error,
    request: Request,
    response: Response,
    next: NextFunction
  ) {
    const isErrorLaunchedFromDomain =
      (error as unknown as Exception).kind !== undefined;
    if (isErrorLaunchedFromDomain) {
      const domainException = error as unknown as Exception;
      response.status(StatusCode[domainException.kind] || 400).json({
        message: domainException.message,
        status: StatusCode[domainException.kind] || 400,
        type: domainException.kind,
      });
    } else {
      ErrorHandler(error, request, response, next);
    }
  }
}
