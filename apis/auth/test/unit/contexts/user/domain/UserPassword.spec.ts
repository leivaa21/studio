import { InvalidPasswordError } from '@studio/commons';
import { UserPassword } from '../../../../../src/contexts/users/domain/UserPassword';
import {
  PossibleSymbol,
  StringMother,
} from '../../../../helpers/object-mother/StringMother';

describe('User Password Tests', () => {
  it(`should assert password that are shorter than ${UserPassword.MIN_LENGTH} characters`, () => {
    const tooLowLength = UserPassword.MIN_LENGTH - 1;
    const invalidPassword = StringMother.random({
      length: tooLowLength,
      casing: 'mixed',
      withSymbols: UserPassword.acceptedSymbols as PossibleSymbol[],
    });
    expect(() => UserPassword.new(invalidPassword)).toThrowError(
      InvalidPasswordError
    );
  });
  it(`should assert password with no uppercasing is invalid`, () => {
    const invalidPassword = StringMother.random({
      minLength: UserPassword.MIN_LENGTH,
      casing: 'lower',
      withSymbols: UserPassword.acceptedSymbols as PossibleSymbol[],
    });
    expect(() => UserPassword.new(invalidPassword)).toThrowError(
      InvalidPasswordError
    );
  });

  it(`should assert password with no lowercasing is invalid`, () => {
    const invalidPassword = StringMother.random({
      minLength: UserPassword.MIN_LENGTH,
      casing: 'upper',
      withSymbols: UserPassword.acceptedSymbols as PossibleSymbol[],
    });
    expect(() => UserPassword.new(invalidPassword)).toThrowError(
      InvalidPasswordError
    );
  });

  it(`should assert password with no numbers is invalid`, () => {
    const invalidPassword = StringMother.random({
      minLength: UserPassword.MIN_LENGTH,
      casing: 'mixed',
      withSymbols: UserPassword.acceptedSymbols as PossibleSymbol[],
      onlyAlpha: true,
    });
    expect(() => UserPassword.new(invalidPassword)).toThrowError(
      InvalidPasswordError
    );
  });

  it(`should assert password with no valid symbols is invalid`, () => {
    const invalidPassword = StringMother.random({
      minLength: UserPassword.MIN_LENGTH,
      casing: 'mixed',
    });
    expect(() => UserPassword.new(invalidPassword)).toThrowError(
      InvalidPasswordError
    );
  });

  it(`should assert password with a space is invalid`, () => {
    const invalidPassword = StringMother.random({
      minLength: UserPassword.MIN_LENGTH,
      casing: 'mixed',
      withSymbols: [' '],
    });
    expect(() => UserPassword.new(invalidPassword)).toThrowError(
      InvalidPasswordError
    );
  });

  it(`should let instanciate a valid password`, () => {
    const invalidPassword = StringMother.random({
      minLength: UserPassword.MIN_LENGTH,
      casing: 'mixed',
      withSymbols: UserPassword.acceptedSymbols as PossibleSymbol[],
    });
    expect(UserPassword.new(invalidPassword).value).toBeDefined();
  });
});
