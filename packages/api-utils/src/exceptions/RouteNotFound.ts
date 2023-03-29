import { StatusCode } from "../http";
import { HttpError } from "../interfaces/httpError";

export class RouteNotFound extends Error implements HttpError  {
  public readonly statusCode: number;
  constructor(method: string, path: string) {
    super(`Cannot ${method} ${path}`);
    this.statusCode = StatusCode.NOT_FOUND;
  }
}
