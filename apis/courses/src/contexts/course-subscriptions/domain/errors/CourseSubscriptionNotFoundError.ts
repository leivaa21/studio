import { ApiError, ErrorCodes } from '@studio/commons';

export class CourseSubscriptionNotFoundError extends ApiError {
  constructor(message: string) {
    super({
      apiStatus: 404,
      kind: 'NOT_FOUND',
      errorCode: ErrorCodes.CourseNotFound,
      message,
    });
  }
  public static searchedByUserAndCourse(userId: string, courseId: string) {
    return new this(
      `User <${userId}> is not subscribed to course <${courseId}> couldn't be found`
    );
  }
}
