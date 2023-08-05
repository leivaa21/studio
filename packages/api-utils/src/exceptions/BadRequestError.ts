import { ApiError, ErrorCodes } from "@studio/commons";
import { StatusCode } from "../http";

export class BadRequestError extends ApiError  {
  constructor(message: string) {
    super({
      apiStatus: StatusCode.BAD_REQUEST,
      kind: 'BAD_REQUEST',
      errorCode: ErrorCodes.BadRequest,
      message,
    });
  }
}
