import { UserPassword } from '../../../src/contexts/users/domain/UserPassword';
import { PossibleSymbol, StringMother } from '../object-mother/StringMother';

export function generateValidPassword() {
  return StringMother.random({
    minLength: UserPassword.MIN_LENGTH,
    casing: 'mixed',
    withSymbols: UserPassword.acceptedSymbols as PossibleSymbol[],
  });
}
