import { ValueObject } from '../../shared/domain/valueObjects/ValueObject';
import { InvalidUserNickname } from './exceptions/InvalidUserNickname';

export class UserNickname extends ValueObject<string> {
  static MAX_LENGTH = 16;
  static MIN_LENGTH = 3;
  public constructor(value: string) {
    super(value);
    this.assertLength();
  }
  public static of(value: string): UserNickname {
    return new UserNickname(value);
  }
  assertLength(): void {
    if (this.value.length > UserNickname.MAX_LENGTH) {
      throw InvalidUserNickname.causeMaxLengthExceded(this.value);
    }
    if (this.value.length < UserNickname.MIN_LENGTH) {
      throw InvalidUserNickname.causeMinLengthNotReached(this.value);
    }
  }
}
