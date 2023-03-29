export enum ErrorCodes {
  InvalidCredential = 'auth.invalid-credentials',
  BadRequest = 'general.bad_request',
  InvalidPassword = 'auth.invalid-password',
  InvalidNickname = 'auth.invalid-nickname',
  InvalidEmail = 'auth.invalid-email',
  NicknameAlreadyInUse = 'auth.used-nickname',
  EmailAlreadyInUse = 'auth.used-email',
  UserNotFound = 'auth.user-not-found',
  InternalServerError = 'internal.error'
}