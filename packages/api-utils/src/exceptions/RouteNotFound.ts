import { StatusCode } from "../http";
import { ApiError, ErrorCodes } from "@studio/commons";

export class RouteNotFoundError extends ApiError  {
  constructor(method: string, path: string) {
    super({
      apiStatus: StatusCode.NOT_FOUND,
      kind: 'NOT_FOUND',
      errorCode: ErrorCodes.RouteNotFound,
      message: `Cannot ${method} ${path}`,
    });
  }
}
