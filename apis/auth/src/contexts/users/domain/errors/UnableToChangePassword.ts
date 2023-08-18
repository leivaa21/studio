import { ErrorCodes, ApiError } from '@studio/commons';
import { PossibleUserCredentialsType } from '../PossibleUserCredentials';

export class UnableToChangePassword extends ApiError {
  constructor(message: string) {
    super({
      kind: 'BAD_REQUEST',
      errorCode: ErrorCodes.UnableToChangePassword,
      apiStatus: 400,
      message,
    });
  }
  public static causeHasWrongCredentialType(
    userId: string,
    credentialType: PossibleUserCredentialsType
  ) {
    return new this(
      `User <${userId}> can't change password because has credential type ${credentialType}!`
    );
  }
}
