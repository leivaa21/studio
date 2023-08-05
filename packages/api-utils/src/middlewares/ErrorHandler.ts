import { NextFunction, Request, Response } from "express";
import { StatusCode } from "../http";
import { ApiError, ErrorCodes } from "@studio/commons";

export function ErrorHandler(err: Error, req: Request, res: Response, next: NextFunction) {

  let data = {
    message: err.message,
    status: StatusCode.INTERNAL_ERROR,
    kind: 'Internal Server Error',
    errorCode: ErrorCodes.InternalServerError as string
  }

  if ((err as ApiError).apiStatus) {
    const apiError = err as ApiError;
    data.status = apiError.apiStatus;
    data.kind = apiError.kind;
    data.errorCode = apiError.errorCode;
    data.message = apiError.message;
  }

  res.status(data.status).json(data).end();

}
