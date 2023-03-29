import { ErrorCodes } from '@studio/commons/dist/errors/ErrorCodes';
import { ApiError } from '@studio/commons/dist/contexts/shared/domain/errors/ApiError';

export class InvalidUserError extends ApiError {
  constructor(errorCode: ErrorCodes, message: string) {
    super({
      kind: 'BAD_REQUEST',
      errorCode,
      apiStatus: 400,
      message,
    });
  }
  public static causeEmailIsAlreadyInUse(email: string) {
    return new this(
      ErrorCodes.EmailAlreadyInUse,
      `The email <${email}> is already in use!`
    );
  }
  public static causeNicknameIsAlreadyInUse(nickname: string) {
    return new this(
      ErrorCodes.NicknameAlreadyInUse,
      `The nickname <${nickname}> is already in use!`
    );
  }
}
