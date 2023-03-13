import {
  Exception,
  ExceptionKind,
} from '../../../shared/domain/exceptions/Exception';

export class InvalidUserException extends Error implements Exception {
  readonly kind: ExceptionKind = 'BAD_REQUEST';

  constructor(message: string) {
    super(message);
  }
  public static causeEmailIsAlreadyInUse(email: string) {
    return new this(`The email <${email}> is already in use!`);
  }
  public static causeNicknameIsAlreadyInUse(nickname: string) {
    return new this(`The nickname <${nickname}> is already in use!`);
  }
}
