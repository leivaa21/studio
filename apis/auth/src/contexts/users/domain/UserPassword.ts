import bcrypt from 'bcrypt';
import { Password } from '@studio/commons';
import { InvalidPasswordError } from './errors/InvalidPassword';

/**
 * Password security rules
 *
 * MIN_LENGHT === 8
 * SHOULD CONTAIN = [lowercase, UPPERCASE, numb3rs, Symbols]
 *
 */

export class UserPassword extends Password {
  static acceptedSymbols = [
    '@',
    '#',
    '?',
    '!',
    '¿',
    '¡',
    '-',
    '_',
    '.',
    '$',
    '%',
  ];

  static MIN_LENGTH = 8;

  public static new(value: string) {
    this.assertIsSecure(value);
    const hash = bcrypt.hashSync(value, 12);
    return new this(hash);
  }

  public static of(value: string): UserPassword {
    return new UserPassword(value);
  }

  public doMatch(password: string) {
    return bcrypt.compareSync(password, this.value);
  }

  private static assertIsSecure(password: string) {
    if (password.length < 8) {
      throw InvalidPasswordError.causePasswordIsTooShort(password);
    }

    if (!/[a-z]/.exec(password)) {
      throw InvalidPasswordError.causePasswordShouldContainLowercase(password);
    }

    if (!/[A-Z]/.exec(password)) {
      throw InvalidPasswordError.causePasswordShouldContainUppercase(password);
    }

    if (!/[0-9]/.exec(password)) {
      throw InvalidPasswordError.causePasswordShouldContainNumber(password);
    }

    const regexForSymbols = new RegExp(
      `[${UserPassword.acceptedSymbols.join('\\')}]`
    );

    if (!regexForSymbols.exec(password)) {
      throw InvalidPasswordError.causePasswordShouldContainSymbol(password);
    }
  }
}
