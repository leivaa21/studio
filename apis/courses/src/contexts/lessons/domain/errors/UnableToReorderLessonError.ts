import { ApiError, ErrorCodes } from '@studio/commons';

export class UnableToReorderLessonError extends ApiError {
  constructor(message: string) {
    super({
      apiStatus: 400,
      kind: 'BAD_REQUEST',
      errorCode: ErrorCodes.UnableToReorderLesson,
      message,
    });
  }
  public static lessonIsAlreadyFirst(id: string) {
    return new this(
      `Lesson with id = <${id}> is already first lesson on course`
    );
  }
}
