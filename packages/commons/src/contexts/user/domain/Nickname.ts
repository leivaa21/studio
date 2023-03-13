import { ValueObject } from '../../shared/domain/ValueObject';
import { InvalidUserNickname } from './exceptions/InvalidUserNickname';

export class Nickname extends ValueObject<string> {

  static MAX_LENGTH = 16;
  static MIN_LENGTH = 3;

  public constructor(value: string) {
    super(value);
    this.assertLength();
  }

  public static of(value: string): Nickname {
    return new Nickname(value);
  }

  public assertLength(): void {
    if (this.value.length > Nickname.MAX_LENGTH) {
      throw InvalidUserNickname.causeMaxLengthExceded(this.value);
    }
    if (this.value.length < Nickname.MIN_LENGTH) {
      throw InvalidUserNickname.causeMinLengthNotReached(this.value);
    }
  }
}
