import { ApiError, ErrorCodes } from "@studio/commons";
import { StatusCode } from "../http";

export class UnauthorizedError extends ApiError  {
  constructor(method: string, path: string) {
    super({
      apiStatus: StatusCode.UNAUTHORIZED,
      kind: 'UNAUTHORIZED',
      errorCode: ErrorCodes.Unauthorized,
      message: `Authorization is required for request on ${method} ${path}`,
    });
  }
}
