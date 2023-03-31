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
  [ErrorCodes.PasswordTooShort, 'Password should be longer than 8 characters'],
  [
    ErrorCodes.PasswordShouldContainLowercase,
    'Password should contain atleast one lowercase',
  ],
  [
    ErrorCodes.PasswordShouldContainUppercase,
    'Password should contain atleast one uppercase',
  ],
  [
    ErrorCodes.PasswordShouldContainNumber,
    'Password should contain atleast one number',
  ],
  [
    ErrorCodes.PasswordShouldContainSymbol,
    'Password should contain atleast one symbol',
  ],
]);

export function decodeError(errorCode: string): string {
  return errorCodeToErrorMessage.get(errorCode) || 'Unhandled Error :(';
}
