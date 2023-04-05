import { ValueObject } from '@studio/commons';
import { InvalidEmailError } from './errors/InvalidEmail';

export class UserEmail extends ValueObject<string> {
  constructor(value: string) {
    super(value.toLowerCase());
  }

  static validate(value: string) {
    const emailRegex = new RegExp(
      /^[A-Za-z0-9_!#$%&'*+/=?`{|}~^.-]+@[A-Za-z0-9.-]+$/,
      'gm'
    );
    if (!emailRegex.test(value)) {
      throw InvalidEmailError.causeEmailIsNotValid(value);
    }
  }

  static of(value: string): UserEmail {
    this.validate(value);
    return new UserEmail(value);
  }
}
