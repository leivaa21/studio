import { ValueObject } from '../../shared/domain/ValueObject';
import { InvalidUserNicknameError } from './errors/InvalidUserNicknameError';

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
      throw InvalidUserNicknameError.causeMaxLengthExceded(this.value);
    }
    if (this.value.length < Nickname.MIN_LENGTH) {
      throw InvalidUserNicknameError.causeMinLengthNotReached(this.value);
    }
  }
}