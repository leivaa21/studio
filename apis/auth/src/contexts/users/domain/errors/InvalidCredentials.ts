import { ErrorCodes } from '@studio/commons/dist/errors/ErrorCodes';
import { ApiError } from '@studio/commons/dist/contexts/shared/domain/errors/ApiError';

export class InvalidCredentialsError extends ApiError {
  constructor(errorCode: ErrorCodes, message: string) {
    super({
      kind: 'BAD_REQUEST',
      errorCode,
      apiStatus: 400,
      message,
    });
  }
  public static causeBasicCredentialsDoNotMatch() {
    return new this(
      ErrorCodes.InvalidCredential,
      `The email or the password do not match`
    );
  }
}
