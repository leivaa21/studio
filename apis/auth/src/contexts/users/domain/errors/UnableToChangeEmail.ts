import { ErrorCodes } from '@studio/commons';
import { ApiError } from '@studio/commons';
import { PossibleUserCredentialsType } from '../PossibleUserCredentials';

export class UnableToChangeEmail extends ApiError {
  constructor(message: string) {
    super({
      kind: 'BAD_REQUEST',
      errorCode: ErrorCodes.UnableToChangeEmail,
      apiStatus: 400,
      message,
    });
  }
  public static causeHasWrongCredentialType(
    userId: string,
    credentialType: PossibleUserCredentialsType
  ) {
    return new this(
      `User <${userId}> can't change email because has credential type ${credentialType}!`
    );
  }
}
