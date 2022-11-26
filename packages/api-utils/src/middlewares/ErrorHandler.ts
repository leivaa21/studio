import { NextFunction, Request, Response } from "express";
import { StatusCode } from "../http";
import HttpError from "../interfaces/httpError";

function ErrorHandler(err: Error, req: Request, res: Response, next: NextFunction) {

  let data = {
    message: err.message,
    status: StatusCode.INTERNAL_ERROR,
    type: 'Internal Server Error',
  }

  if ((err as HttpError).statusCode) {
    const httpErr = err as HttpError;
    data.status = httpErr.statusCode;
    data.type  = httpErr.constructor.name.split(/(?=[A-Z])/).join(' ');
  }

  res.status(data.status).json(data).end();

}

export default ErrorHandler;