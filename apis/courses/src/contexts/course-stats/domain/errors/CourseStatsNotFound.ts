import { ApiError, ErrorCodes } from '@studio/commons';

export class CourseStatsNotFoundError extends ApiError {
  constructor(message: string) {
    super({
      apiStatus: 404,
      kind: 'NOT_FOUND',
      errorCode: ErrorCodes.CourseStatsNotFound,
      message,
    });
  }
  public static searchedByCourse(courseId: string) {
    return new this(`Stats for course id = <${courseId}> couldn't be found`);
  }
}
