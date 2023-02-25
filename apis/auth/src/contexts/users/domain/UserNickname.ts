import { ValueObject } from '../../shared/domain/valueObjects/ValueObject';
import { UserNicknameLenghtExceeded } from './exceptions/UserNicknameLengthExceeded';

export class UserNickname extends ValueObject<string> {
  static MAX_LENGTH = 16;
  public constructor(value: string) {
    super(value);
    this.assertLength();
  }
  public static of(value: string): UserNickname {
    return new UserNickname(value);
  }
  assertLength(): void {
    if (this.value.length > UserNickname.MAX_LENGTH) {
      throw new UserNicknameLenghtExceeded(this.value);
    }
  }
}
