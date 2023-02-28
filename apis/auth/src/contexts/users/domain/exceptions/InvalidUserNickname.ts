import {
  Exception,
  ExceptionKind,
} from '../../../shared/domain/exceptions/Exception';
import { UserNickname } from '../UserNickname';

export class InvalidUserNickname extends Error implements Exception {
  readonly kind: ExceptionKind = 'BAD_REQUEST';

  constructor(message: string) {
    super(message);
  }
  public static causeMaxLengthExceded(nickname: string) {
    return new this(
      `Nicknames can't be longer than ${UserNickname.MAX_LENGTH} => <${nickname}>`
    );
  }
  public static causeMinLengthNotReached(nickname: string) {
    return new this(
      `Nicknames can't be shorter than ${UserNickname.MIN_LENGTH} => <${nickname}>`
    );
  }
}
