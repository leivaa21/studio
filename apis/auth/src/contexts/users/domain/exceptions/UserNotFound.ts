import {
  Exception,
  ExceptionKind,
} from '../../../shared/domain/exceptions/Exception';

export class UserNotFoundException extends Error implements Exception {
  readonly kind: ExceptionKind = 'NOT_FOUND';

  constructor(message: string) {
    super(message);
  }
  public static searchedById(id: string) {
    return new this(`User with id = <${id}> couldn't be found`);
  }
}
