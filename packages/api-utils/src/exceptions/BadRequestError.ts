import { StatusCode } from "../http";
import { HttpError } from "../interfaces/httpError";

export class BadRequestError extends Error implements HttpError  {
  public readonly statusCode: number;
  constructor(message: string) {
    super(message);
    this.statusCode = StatusCode.BAD_REQUEST;
  }
}
