import { ApiError, ErrorCodes } from '@studio/commons';

export class UnableToUncompleteError extends ApiError {
  constructor(message: string) {
    super({
      apiStatus: 400,
      kind: 'BAD_REQUEST',
      errorCode: ErrorCodes.UnableToUncompleteCourseSubscription,
      message,
    });
  }
  public static notCompleted(courseSubscriptionId: string) {
    return new this(
      `Course Subscription <${courseSubscriptionId}> has not been completed`
    );
  }
}
