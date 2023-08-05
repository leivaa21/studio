import { ApiError, ErrorCodes, MAX_LESSON_TITLE_LENGTH } from '@studio/commons';

export class InvalidLessonTitleError extends ApiError {
  constructor(message: string) {
    super({
      apiStatus: 400,
      kind: 'BAD_REQUEST',
      errorCode: ErrorCodes.InvalidLessonTitle,
      message,
    });
  }
  public static maxLengthExceeded(value: string) {
    return new this(
      `Lesson titles should not be longer than <${MAX_LESSON_TITLE_LENGTH}> {${value}}`
    );
  }
}
