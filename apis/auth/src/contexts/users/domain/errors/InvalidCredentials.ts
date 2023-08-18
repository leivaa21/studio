import { ErrorCodes } from '@studio/commons';
import { ApiError } from '@studio/commons';

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

  public static causePasswordDoNotMatch() {
    return new this(ErrorCodes.InvalidCredential, `The password do not match`);
  }

  public static causeGoogleCredentialsDoNotMatch() {
    return new this(
      ErrorCodes.InvalidCredential,
      `The google credentials do not match`
    );
  }

  public static causeGithubCredentialsDoNotMatch() {
    return new this(
      ErrorCodes.InvalidCredential,
      `The github credentials do not match`
    );
  }
}
