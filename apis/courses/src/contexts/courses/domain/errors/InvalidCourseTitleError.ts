import { ApiError, ErrorCodes, MAX_COURSE_TITLE_LENGTH } from '@studio/commons';

export class InvalidCourseTitleError extends ApiError {
  constructor(message: string) {
    super({
      apiStatus: 400,
      kind: 'BAD_REQUEST',
      errorCode: ErrorCodes.InvalidCourseTitle,
      message,
    });
  }
  public static maxLengthExceeded(value: string) {
    return new this(
      `Course titles should not be longer than <${MAX_COURSE_TITLE_LENGTH}> {${value}}`
    );
  }
}
