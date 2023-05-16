import { UserGoogleCredentials } from '../../../../../src/contexts/users/domain/UserGoogleCredentials';
import { GoogleId } from '../../../../../src/contexts/users/domain/GoogleId';
import { StringMother } from '../../../../helpers/object-mother/StringMother';
import { EmailMother } from '../../../../helpers/object-mother/UserEmailMother';

it('should have type as "GOOGLE"', () => {
  const email = EmailMother.random();
  const googleId = GoogleId.of(StringMother.random());

  const credentials = UserGoogleCredentials.of({ email, googleId });

  expect(credentials.type).toBe('GOOGLE');
});

it('should be possible to verify basic credentials', () => {
  const email = EmailMother.random();
  const googleId = GoogleId.of(StringMother.random());

  const credentials = UserGoogleCredentials.of({ email, googleId });

  expect(credentials.doMatch({ email, googleId })).toBeTruthy();
});

it('should not verify wrong credentials', () => {
  const email = EmailMother.random();
  const googleId = GoogleId.of(StringMother.random());

  const credentials = UserGoogleCredentials.of({ email, googleId });

  expect(
    credentials.doMatch({ email, googleId: GoogleId.of(StringMother.random()) })
  ).toBeFalsy();
  expect(
    credentials.doMatch({ email: EmailMother.random(), googleId })
  ).toBeFalsy();
});
