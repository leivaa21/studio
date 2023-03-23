import { ErrorCodes } from "../../../../errors/ErrorCodes";
import { ApiError } from "./ApiError";
export class UndefinedArgumentError extends ApiError {

  constructor(className: string) {
    super({
      kind: 'BAD_REQUEST',
      errorCode: ErrorCodes.BadRequest,
      apiStatus: 400,
      message: `Value of ${className} must be defined`
    });
  }
}
