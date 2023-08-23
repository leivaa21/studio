import { InvalidArgumentError, ValueObject } from '@studio/commons';

export class AuthorStatNumber extends ValueObject<number> {
  static of(value: number): AuthorStatNumber {
    if (value < 0) {
      throw new InvalidArgumentError(this.name, value.toString());
    }

    return new AuthorStatNumber(value);
  }

  public decrease(): AuthorStatNumber {
    return AuthorStatNumber.of(this.value - 1);
  }

  public increase(): AuthorStatNumber {
    return AuthorStatNumber.of(this.value + 1);
  }
}
