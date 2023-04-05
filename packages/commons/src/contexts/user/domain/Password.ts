import { ValueObject } from '../../shared/domain/ValueObject';
import { InvalidPasswordError } from './errors/InvalidPasswordError';
export class Password extends ValueObject<string> {

  public static fromPrimitives(hash: string) {
    return new this(hash);
  }

  protected constructor(value: string) {
    super(value);
  }

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

  public static of(value: string): Password {
    return new Password(value);
  }

  public static assertIsSecure(password: string) {
    if(password.includes(' ')) {
      throw InvalidPasswordError.causePasswordContainsSpaces(password)
    }
    
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
      `[${Password.acceptedSymbols.join('\\')}]`
    );

    if (!regexForSymbols.exec(password)) {
      throw InvalidPasswordError.causePasswordShouldContainSymbol(password);
    }
  }

}
