import { ApiError, ErrorCodes } from '@studio/commons';

export class NotAbleToUnpublishCourseError extends ApiError {
  constructor(message: string) {
    super({
      apiStatus: 404,
      kind: 'NOT_FOUND',
      errorCode: ErrorCodes.UnableToUnpublishCourse,
      message,
    });
  }
  public static notPublished(id: string) {
    return new this(`Course with id = <${id}> is not published`);
  }
}
