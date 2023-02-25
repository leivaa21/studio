import { Exception } from '../../../shared/domain/exceptions/Exception';

export class InvalidUserException extends Error implements Exception {
  readonly kind: string = 'BAD_REQUEST';

  constructor(message: string) {
    super(message);
  }
  public static causeEmailIsAlreadyInUse(email: string) {
    return new this(`The email <${email}> is already in use!`);
  }
}
