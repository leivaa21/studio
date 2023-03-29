import { ErrorCodes } from '@studio/commons';

const errorCodeToErrorMessage = new Map<string, string>([
  [ErrorCodes.EmailAlreadyInUse, 'The email is already in use'],
  [ErrorCodes.NicknameAlreadyInUse, 'The nickname is already in use'],
  [ErrorCodes.InternalServerError, 'Something happened'],
  [
    ErrorCodes.InvalidCredential,
    'Credentials do not match with any account :(',
  ],
  [ErrorCodes.InvalidNickname, 'The nickname is invalid :('],
  [ErrorCodes.InvalidEmail, 'The email is invalid :('],
  [ErrorCodes.InvalidPassword, 'The password is invalid :('],
  [ErrorCodes.UserNotFound, 'Unable to find that user :('],
  [ErrorCodes.BadRequest, 'Something went wrong with the request :$'],
]);

export function decodeError(errorCode: string): string {
  return errorCodeToErrorMessage.get(errorCode) || 'Unhandled Error :(';
}
