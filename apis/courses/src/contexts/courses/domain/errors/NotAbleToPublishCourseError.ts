import { ApiError, ErrorCodes } from '@studio/commons';

export class NotAbleToPublishCourseError extends ApiError {
  constructor(message: string) {
    super({
      apiStatus: 404,
      kind: 'NOT_FOUND',
      errorCode: ErrorCodes.UnableToPublishCourse,
      message,
    });
  }
  public static alreadyPublished(id: string) {
    return new this(`Course with id = <${id}> is already published`);
  }
}
