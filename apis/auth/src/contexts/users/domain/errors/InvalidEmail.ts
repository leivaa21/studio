import { ErrorCodes } from '@studio/commons';
import { ApiError } from '@studio/commons';

export class InvalidEmailError extends ApiError {
  constructor(errorCode: ErrorCodes, message: string) {
    super({
      kind: 'BAD_REQUEST',
      errorCode,
      apiStatus: 400,
      message,
    });
  }
  public static causeEmailIsNotValid(email: string) {
    return new this(
      ErrorCodes.InvalidEmail,
      `<${email}> is not a valid email!`
    );
  }
}
