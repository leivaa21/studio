import { ApiError, ErrorCodes } from '@studio/commons';

export class UnableToCompleteLessonError extends ApiError {
  constructor(message: string) {
    super({
      apiStatus: 400,
      kind: 'BAD_REQUEST',
      errorCode: ErrorCodes.UnableToCompleteLesson,
      message,
    });
  }
  public static alreadyCompleted(
    courseSubscriptionId: string,
    lessonId: string
  ) {
    return new this(
      `Course Subscription <${courseSubscriptionId}> has already completed lesson <$${lessonId}>`
    );
  }
}
