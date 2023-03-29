import { StatusCode } from '@studio/api-utils';
import { ErrorHandler } from '@studio/api-utils';
import { ApiError } from '@studio/commons';
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
    const isErrorLaunchedFromDomain =
      (error as unknown as ApiError).kind !== undefined;
    if (isErrorLaunchedFromDomain) {
      const domainError = error as unknown as ApiError;
      response
        .status(StatusCode[domainError.kind] || StatusCode.BAD_REQUEST)
        .json({
          message: domainError.message,
          apiStatus: StatusCode[domainError.kind] || StatusCode.BAD_REQUEST,
          errorCode: domainError.errorCode,
          kind: domainError.kind,
        });
    } else {
      ErrorHandler(error, request, response, next);
    }
  }
}
