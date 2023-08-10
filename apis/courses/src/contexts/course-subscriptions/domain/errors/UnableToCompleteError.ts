import { ApiError, ErrorCodes } from '@studio/commons';

export class UnableToCompleteError extends ApiError {
  constructor(message: string) {
    super({
      apiStatus: 400,
      kind: 'BAD_REQUEST',
      errorCode: ErrorCodes.UnableToCompleteCourseSubscription,
      message,
    });
  }
  public static alreadyCompleted(courseSubscriptionId: string) {
    return new this(
      `Course Subscription <${courseSubscriptionId}> has already been completed`
    );
  }
}
