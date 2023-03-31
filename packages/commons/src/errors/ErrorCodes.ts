export enum ErrorCodes {
  InvalidCredential = 'auth.invalid-credentials',
  BadRequest = 'general.bad_request',
  InvalidPassword = 'auth.invalid-password',
  InvalidNickname = 'auth.invalid-nickname',
  InvalidEmail = 'auth.invalid-email',
  NicknameAlreadyInUse = 'auth.used-nickname',
  EmailAlreadyInUse = 'auth.used-email',
  UserNotFound = 'auth.user-not-found',
  InternalServerError = 'internal.error',
  PasswordTooShort = 'auth.password-too-short',
  PasswordShouldContainLowercase = 'auth.password-lowercase',
  PasswordShouldContainUppercase = 'auth.password-uppercase',
  PasswordShouldContainNumber = 'auth.password-number',
  PasswordShouldContainSymbol = 'auth.password-symbol'
}