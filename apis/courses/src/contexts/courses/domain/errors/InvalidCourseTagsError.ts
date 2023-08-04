import { ApiError, ErrorCodes, MAX_TAGS_COUNT } from '@studio/commons';

export class InvalidCourseTagsError extends ApiError {
  constructor(message: string) {
    super({
      apiStatus: 400,
      kind: 'BAD_REQUEST',
      errorCode: ErrorCodes.InvalidCourseTags,
      message,
    });
  }
  public static hasDuplicatedTags(value: string[]) {
    return new this(
      `Course tags should not be duplicated {${value.toString()}}`
    );
  }

  public static hasExceededTagCountLimit(value: string[]) {
    return new this(
      `Course tag count should not exceed <${MAX_TAGS_COUNT}> {${value.toString()}}`
    );
  }
}
