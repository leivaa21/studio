import { InvalidEmailError } from '../../../../../src/contexts/users/domain/errors/InvalidEmail';
import { UserEmail } from '../../../../../src/contexts/users/domain/UserEmail';
import { StringMother } from '../../../../helpers/object-mother/StringMother';
import { EmailMother } from '../../../../helpers/object-mother/UserEmailMother';

describe('User Email Tests', () => {
  it('Should assert emails that are not valid', () => {
    expect(() => {
      UserEmail.of(StringMother.random());
    }).toThrowError(InvalidEmailError);
  });

  it('Should let instanciate an email thats valid', () => {
    const email = EmailMother.random().value;

    const nickname = UserEmail.of(email);
    expect(nickname.value).toBe(email);
  });
});
