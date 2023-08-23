import { ApiError, ErrorCodes } from '@studio/commons';

export class ConsumerStatsNotFoundError extends ApiError {
  constructor(message: string) {
    super({
      apiStatus: 404,
      kind: 'NOT_FOUND',
      errorCode: ErrorCodes.ConsumerStatsNotFound,
      message,
    });
  }
  public static searchedByUser(userId: string) {
    return new this(
      `Consumer Stats for user id = <${userId}> couldn't be found`
    );
  }
}
