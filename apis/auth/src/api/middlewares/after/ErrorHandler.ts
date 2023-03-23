import { StatusCode } from '@studio/api-utils/http';
import { ErrorHandler } from '@studio/api-utils/middlewares';
import { ApiError } from '@studio/commons/dist/contexts/shared/domain/errors/ApiError';
import { NextFunction, Request, Response } from 'express';
import {
  Middleware,
  ExpressErrorMiddlewareInterface,
} from 'routing-controllers';
@Middleware({ priority: 0, type: 'after' })
export class CustomErrorHandler implements ExpressErrorMiddlewareInterface {
  error(
    error: Error,
    request: Request,
    response: Response,
    next: NextFunction
  ) {
    const isErrorLaunchedFromDomain =
      (error as unknown as ApiError).kind !== undefined;
    if (isErrorLaunchedFromDomain) {
      const domainException = error as unknown as ApiError;
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
