import { ApiError, ErrorCodes } from '@studio/commons';

export class LessonNotFoundError extends ApiError {
  constructor(message: string) {
    super({
      apiStatus: 404,
      kind: 'NOT_FOUND',
      errorCode: ErrorCodes.LessonNotFound,
      message,
    });
  }
  public static searchedById(id: string) {
    return new this(`Lesson with id = <${id}> couldn't be found`);
  }

  public static searchedByOrderOnArray(order: number, array: string[]) {
    return new this(
      `Unable to find lesson with order <${order}> on lessons ${array.toString()}`
    );
  }
}
