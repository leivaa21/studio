import { ApiError, ErrorCodes } from '@studio/commons';

export class AuthorStatsNotFoundError extends ApiError {
  constructor(message: string) {
    super({
      apiStatus: 404,
      kind: 'NOT_FOUND',
      errorCode: ErrorCodes.AuthorStatsNotFound,
      message,
    });
  }
  public static searchedByAuthor(authorId: string) {
    return new this(
      `Author Stats for author id = <${authorId}> couldn't be found`
    );
  }
}
