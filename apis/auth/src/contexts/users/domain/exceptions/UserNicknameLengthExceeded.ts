import { Exception } from '../../../shared/domain/exceptions/Exception';
import UserNickname from '../UserNickname';

export default class UserNicknameLenghtExceeded
  extends Error
  implements Exception
{
  readonly kind: string = 'BAD_REQUEST';

  constructor(value: string) {
    super(
      `Nicknames can't be longer than ${UserNickname.MAX_LENGTH} => <${value}>`
    );
  }
}
