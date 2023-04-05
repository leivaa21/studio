import { InvalidNicknameError } from '@studio/commons';
import { UserNickname } from '../../../../../src/contexts/users/domain/UserNickname';
import { StringMother } from '../../../../helpers/object-mother/StringMother';
import { EmailMother } from '../../../../helpers/object-mother/UserEmailMother';

describe('User Nickname Tests', () => {
  it(`Should assert nicknames shorter than ${UserNickname.MIN_LENGTH} characters`, () => {
    expect(() => {
      UserNickname.of(
        StringMother.random({ length: UserNickname.MIN_LENGTH - 1 })
      );
    }).toThrowError(InvalidNicknameError);
  });

  it(`Should assert nicknames longer than ${UserNickname.MAX_LENGTH} characters`, () => {
    expect(() => {
      UserNickname.of(
        StringMother.random({
          length: UserNickname.MAX_LENGTH + 1,
        })
      );
    }).toThrowError(InvalidNicknameError);
  });

  it(`Should assert nicknames that contain invalid characters`, () => {
    const randomNicknameWithNonValidSymbol = StringMother.random({
      maxLength: UserNickname.MAX_LENGTH,
      minLength: UserNickname.MIN_LENGTH,
      withSymbols: ['@', '-', '!', '?', '<', '>', '¿', ' ', '¡'],
    });

    expect(() => {
      UserNickname.of(randomNicknameWithNonValidSymbol);
    }).toThrowError(InvalidNicknameError);
  });

  it('Should let instanciate a nickname thats valid', () => {
    const randomNickname = StringMother.random({
      maxLength: UserNickname.MAX_LENGTH,
      minLength: UserNickname.MIN_LENGTH,
      withSymbols: ['_', '.'],
    });

    const nickname = UserNickname.of(randomNickname);
    expect(nickname.value).toBe(randomNickname);
  });

  it('Should let instanciate a nickname without restrictions if it comes from an email', () => {
    const email = EmailMother.random().value;

    const nickname = UserNickname.fromEmail(email);
    expect(nickname.value).toBe(email);
  });
});
