import { ErrorCodes } from '../../../../errors/ErrorCodes';
import { ApiError } from '../../../shared/domain/errors/ApiError';
import { Nickname } from '../Nickname';

export class InvalidNicknameError extends ApiError {

  constructor(errorCode: ErrorCodes, message: string) {
    super({
      kind: 'BAD_REQUEST',
      errorCode: errorCode,
      apiStatus: 400,
      message,
    });
  }

  public static causeMaxLengthExceded(nickname: string) {
    return new this(
      ErrorCodes.InvalidNickname,
      `Nicknames can't be longer than ${Nickname.MAX_LENGTH} => <${nickname}>`
    );
  }

  public static causeMinLengthNotReached(nickname: string) {
    return new this(
      ErrorCodes.InvalidNickname,
      `Nicknames can't be shorter than ${Nickname.MIN_LENGTH} => <${nickname}>`
    );
  }

  public static causeNicknameHasInvalidCharacters(nickname: string) {
    return new this(
      ErrorCodes.InvalidNickname,
      `<${nickname}> contains invalid symbols`
    );
  }
}
