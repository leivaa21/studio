import { ApiError, ErrorCodes } from '@studio/commons';

export class CourseNotFoundError extends ApiError {
  constructor(message: string) {
    super({
      apiStatus: 404,
      kind: 'NOT_FOUND',
      errorCode: ErrorCodes.CourseNotFound,
      message,
    });
  }
  public static searchedById(id: string) {
    return new this(`Course with id = <${id}> couldn't be found`);
  }
}
