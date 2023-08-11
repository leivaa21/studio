import { ApiError, ErrorCodes } from '@studio/commons';

export class UnableToUncompleteLessonError extends ApiError {
  constructor(message: string) {
    super({
      apiStatus: 400,
      kind: 'BAD_REQUEST',
      errorCode: ErrorCodes.UnableToUncompleteLesson,
      message,
    });
  }
  public static notCompleted(courseSubscriptionId: string, lessonId: string) {
    return new this(
      `Course Subscription <${courseSubscriptionId}> has not completed lesson <$${lessonId}>`
    );
  }
}
