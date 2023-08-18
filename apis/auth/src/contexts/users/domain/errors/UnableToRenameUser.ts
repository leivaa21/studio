import { ErrorCodes } from '@studio/commons';
import { ApiError } from '@studio/commons';
import { PossibleUserCredentialsType } from '../PossibleUserCredentials';

export class UnableToRenameUser extends ApiError {
  constructor(message: string) {
    super({
      kind: 'BAD_REQUEST',
      errorCode: ErrorCodes.UnableToRenameUser,
      apiStatus: 400,
      message,
    });
  }
  public static causeHasWrongCredentialType(
    userId: string,
    credentialType: PossibleUserCredentialsType
  ) {
    return new this(
      `User <${userId}> can't be renamed because has credential type ${credentialType}!`
    );
  }
}
