import { ApiError, ErrorCodes } from '@studio/commons';

export class InvalidCourseSubscriptionError extends ApiError {
  constructor(message: string) {
    super({
      apiStatus: 400,
      kind: 'BAD_REQUEST',
      errorCode: ErrorCodes.InvalidCourseSubscription,
      message,
    });
  }
  public static causeAlreadyExistForUserAndCourse(
    userId: string,
    courseId: string
  ) {
    return new this(
      `User <${userId}> is already subscribed to course <${courseId}>`
    );
  }
}
