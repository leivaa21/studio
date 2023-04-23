import { UserNickname } from '../../../src/contexts/users/domain/UserNickname';
import { StringMother } from '../object-mother/StringMother';

export function generateValidNickname() {
  return StringMother.random({
    maxLength: UserNickname.MAX_LENGTH,
    minLength: UserNickname.MIN_LENGTH,
    withSymbols: ['_', '.'],
  });
}
