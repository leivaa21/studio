import { ValueObject } from '../../shared/domain/ValueObject';
import { InvalidNicknameError } from './errors/InvalidNicknameError';

export class Nickname extends ValueObject<string> {

  static MAX_LENGTH = 16;
  static MIN_LENGTH = 3;
  static ValidationRegex = new RegExp(/^[a-zA-Z0-9_.]+$/);

  public constructor(value: string, noAssertions: boolean = false) {
    super(value);

    if(noAssertions) return;

    this.asserts();
  }

  public static of(value: string): Nickname {
    return new Nickname(value);
  }

  public static fromEmail(value: string) {
    return new Nickname(value, true)
  }

  public asserts(): void {
    if (this.value.length > Nickname.MAX_LENGTH) {
      throw InvalidNicknameError.causeMaxLengthExceded(this.value);
    }
    if (this.value.length < Nickname.MIN_LENGTH) {
      throw InvalidNicknameError.causeMinLengthNotReached(this.value);
    }
    if(!Nickname.ValidationRegex.test(this.value)) {
      throw InvalidNicknameError.causeNicknameHasInvalidCharacters(this.value);
    }
  }
}
