import { ApiError } from '@studio/commons/dist/contexts/shared/domain/errors/ApiError';
import { ErrorCodes } from '@studio/commons/dist/errors/ErrorCodes';

export class UserNotFoundError extends ApiError {
  constructor(message: string) {
    super({
      apiStatus: 404,
      kind: 'NOT_FOUND',
      errorCode: ErrorCodes.UserNotFound,
      message,
    });
  }
  public static searchedById(id: string) {
    return new this(`User with id = <${id}> couldn't be found`);
  }
  public static searchedByEmail(email: string) {
    return new this(`User with email = <${email}> couldn't be found`);
  }
}
