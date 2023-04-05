import { InvalidUserNicknameError } from '@studio/commons';
import { UserNickname } from '../../../../../src/contexts/users/domain/UserNickname';
import { StringMother } from '../../../../helpers/object-mother/StringMother';
import { EmailMother } from '../../../../helpers/object-mother/UserEmailMother';

describe('User Nickname Tests', () => {
  it(`Should assert nicknames shorter than ${UserNickname.MIN_LENGTH} characters`, () => {
    expect(() => {
      const lengthToLow = UserNickname.MIN_LENGTH - 1;

      UserNickname.of(
        StringMother.random({ maxLength: lengthToLow, minLength: lengthToLow })
      );
    }).toThrowError(InvalidUserNicknameError);
  });

  it(`Should assert nicknames longer than ${UserNickname.MAX_LENGTH} characters`, () => {
    expect(() => {
      const lengthToHigh = UserNickname.MAX_LENGTH + 1;

      UserNickname.of(
        StringMother.random({
          maxLength: lengthToHigh,
          minLength: lengthToHigh,
        })
      );
    }).toThrowError(InvalidUserNicknameError);
  });

  it('Should let instanciate a nickname thats valid', () => {
    const randomNickname = StringMother.random({
      maxLength: UserNickname.MAX_LENGTH,
      minLength: UserNickname.MIN_LENGTH,
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
