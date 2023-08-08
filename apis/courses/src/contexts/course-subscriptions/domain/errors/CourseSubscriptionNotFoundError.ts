import { ApiError, ErrorCodes } from '@studio/commons';

export class CourseSubscriptionNotFoundError extends ApiError {
  constructor(message: string) {
    super({
      apiStatus: 404,
      kind: 'NOT_FOUND',
      errorCode: ErrorCodes.CourseSubscriptionNotFound,
      message,
    });
  }

  public static searchedById(id: string) {
    return new this(`Course Subscription with id = <${id}> couldn't be found`);
  }

  public static searchedByUserAndCourse(userId: string, courseId: string) {
    return new this(
      `User <${userId}> is not subscribed to course <${courseId}> couldn't be found`
    );
  }
}
