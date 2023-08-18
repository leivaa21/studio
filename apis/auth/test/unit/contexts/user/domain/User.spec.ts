import { UserNickname } from '../../../../../src/contexts/users/domain/UserNickname';
import { User } from '../../../../../src/contexts/users/domain/User';
import { UserBasicCredentials } from '../../../../../src/contexts/users/domain/UserBasicCredentials';
import { UserPassword } from '../../../../../src/contexts/users/domain/UserPassword';
import { generateValidNickname } from '../../../../helpers/lib/generateValidNickname';
import { generateValidPassword } from '../../../../helpers/lib/generateValidPassword';
import { EmailMother } from '../../../../helpers/object-mother/UserEmailMother';
import { UserWasCreatedEvent } from '../../../../../src/contexts/users/domain/events/UserWasCreated';
import { GoogleId } from '../../../../../src/contexts/users/domain/GoogleId';
import { StringMother } from '../../../../helpers/object-mother/StringMother';
import { UserGoogleCredentials } from '../../../../../src/contexts/users/domain/UserGoogleCredentials';
import { UserBuilder } from '../../../../helpers/builders/user/UserBuilder';
import { UserEmail } from '../../../../../src/contexts/users/domain/UserEmail';
import { GithubId } from '../../../../../src/contexts/users/domain/GithubId';
import { NumberMother } from '../../../../helpers/object-mother/NumberMother';
import { UserGithubCredentials } from '../../../../../src/contexts/users/domain/UserGithubCredentials';

describe('Create users', () => {
  it('Should let create user with basic credentials', () => {
    const nickname = UserNickname.of(generateValidNickname());
    const email = EmailMother.random();
    const password = UserPassword.new(generateValidPassword());
    const credentials = UserBasicCredentials.of({ email, password });

    const user = User.createNewWithBasicCredentials({ nickname, credentials });

    expect(user.toPrimitives()).toMatchObject(
      expect.objectContaining({
        nickname: nickname.value,
        credentials: {
          email: email.value,
          password: password.value,
          type: 'BASIC',
        },
      })
    );

    const events = user.pullEvents();

    expect(events).toHaveLength(1);
    expect(events[0].eventName).toBe(UserWasCreatedEvent.EVENT_NAME);
  });

  it('Should let create user with google credentials', () => {
    const nickname = UserNickname.of(generateValidNickname());
    const email = EmailMother.random();
    const googleId = GoogleId.of(StringMother.random());
    const credentials = UserGoogleCredentials.of({ email, googleId });

    const user = User.createNewWithGoogleCredentials({ nickname, credentials });

    expect(user.toPrimitives()).toMatchObject(
      expect.objectContaining({
        nickname: nickname.value,
        credentials: {
          email: email.value,
          googleId: googleId.value,
          type: 'GOOGLE',
        },
      })
    );

    const events = user.pullEvents();

    expect(events).toHaveLength(1);
    expect(events[0].eventName).toBe(UserWasCreatedEvent.EVENT_NAME);
  });

  it('Should let create user with github credentials', () => {
    const nickname = UserNickname.of(generateValidNickname());
    const githubId = GithubId.of(NumberMother.random());
    const credentials = UserGithubCredentials.of({ githubId });

    const user = User.createNewWithGithubCredentials({ nickname, credentials });

    expect(user.toPrimitives()).toMatchObject(
      expect.objectContaining({
        nickname: nickname.value,
        credentials: {
          githubId: githubId.value,
          type: 'GITHUB',
        },
      })
    );

    const events = user.pullEvents();

    expect(events).toHaveLength(1);
    expect(events[0].eventName).toBe(UserWasCreatedEvent.EVENT_NAME);
  });
});

describe('Verify credentials', () => {
  describe('Basic Credentials', () => {
    it('should let verify basic credentials', () => {
      const password = generateValidPassword();

      const user = new UserBuilder()
        .aBasicCredentialsUser()
        .withPlainPassword(password)
        .build();

      expect(
        user.doBasicCredentialMatch((user.email as UserEmail).value, password)
      ).toBeTruthy();
    });

    it('should not verify if email is not correct with basic credentials', () => {
      const password = generateValidPassword();

      const user = new UserBuilder()
        .aBasicCredentialsUser()
        .withPlainPassword(password)
        .build();

      expect(
        user.doBasicCredentialMatch(EmailMother.random().value, password)
      ).toBeFalsy();
    });

    it('should not verify if password is not correct with basic credentials', () => {
      const password = generateValidPassword();

      const user = new UserBuilder().aBasicCredentialsUser().build();

      expect(
        user.doBasicCredentialMatch((user.email as UserEmail).value, password)
      ).toBeFalsy();
    });
  });

  describe('Google Credentials', () => {
    it('Should let verify google credentials', () => {
      const id = GoogleId.of(StringMother.random());
      const user = new UserBuilder()
        .aGoogleCredentialsUser()
        .withGoogleId(id)
        .build();

      expect(
        user.doGoogleCredentialMatch({
          email: user.email as UserEmail,
          googleId: id,
        })
      ).toBeTruthy();
    });

    it('Should not verify if googleId is wrong', () => {
      const id = GoogleId.of(StringMother.random());
      const user = new UserBuilder().aGoogleCredentialsUser().build();

      expect(
        user.doGoogleCredentialMatch({
          email: user.email as UserEmail,
          googleId: id,
        })
      ).toBeFalsy();
    });

    it('Should not verify if email is wrong', () => {
      const id = GoogleId.of(StringMother.random());
      const user = new UserBuilder()
        .aGoogleCredentialsUser()
        .withGoogleId(id)
        .build();

      expect(
        user.doGoogleCredentialMatch({
          email: EmailMother.random(),
          googleId: id,
        })
      ).toBeFalsy();
    });
  });

  describe('Github Credentials', () => {
    it('Should let verify github credentials', () => {
      const id = GithubId.of(NumberMother.random());
      const user = new UserBuilder()
        .aGithubCredentialsUser()
        .withGithubId(id)
        .build();

      expect(
        user.doGithubCredentialMatch({
          githubId: id,
        })
      ).toBeTruthy();
    });

    it('Should not verify if github id is wrong', () => {
      const id = GithubId.of(NumberMother.random());

      const user = new UserBuilder().aGithubCredentialsUser().build();

      expect(
        user.doGithubCredentialMatch({
          githubId: id,
        })
      ).toBeFalsy();
    });
  });
});
