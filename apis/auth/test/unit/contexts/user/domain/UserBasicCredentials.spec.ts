import { UserBasicCredentials } from '../../../../../src/contexts/users/domain/UserBasicCredentials';
import { UserPassword } from '../../../../../src/contexts/users/domain/UserPassword';
import { generateValidPassword } from '../../../../helpers/lib/generateValidPassword';
import { EmailMother } from '../../../../helpers/object-mother/UserEmailMother';

it('should have type as "BASIC"', () => {
  const email = EmailMother.random();
  const plainPassword = generateValidPassword();
  const password = UserPassword.new(plainPassword);

  const credentials = UserBasicCredentials.of({ email, password });

  expect(credentials.type).toBe('BASIC');
});

it('should be possible to verify basic credentials', () => {
  const email = EmailMother.random();
  const plainPassword = generateValidPassword();
  const password = UserPassword.new(plainPassword);

  const credentials = UserBasicCredentials.of({ email, password });

  expect(credentials.doMatch(email.value, plainPassword)).toBeTruthy();
});

it('should not verify wrong credentials', () => {
  const email = EmailMother.random();
  const plainPassword = generateValidPassword();
  const password = UserPassword.new(plainPassword);

  const credentials = UserBasicCredentials.of({ email, password });

  expect(credentials.doMatch(email.value, generateValidPassword())).toBeFalsy();
  expect(
    credentials.doMatch(EmailMother.random().value, plainPassword)
  ).toBeFalsy();
});
