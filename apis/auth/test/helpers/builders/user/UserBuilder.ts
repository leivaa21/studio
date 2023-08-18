import { User } from '../../../../src/contexts/users/domain/User';
import { UserBasicCredentials } from '../../../../src/contexts/users/domain/UserBasicCredentials';
import { UserId } from '../../../../src/contexts/users/domain/UserId';
import { UserNickname } from '../../../../src/contexts/users/domain/UserNickname';
import { UserPassword } from '../../../../src/contexts/users/domain/UserPassword';
import { GoogleId } from '../../../../src/contexts/users/domain/GoogleId';
import { PossibleUserCredentials } from '../../../../src/contexts/users/domain/PossibleUserCredentials';
import { UserGoogleCredentials } from '../../../../src/contexts/users/domain/UserGoogleCredentials';
import { DateMother } from '../../object-mother/DateMother';
import { PossibleSymbol, StringMother } from '../../object-mother/StringMother';
import { EmailMother } from '../../object-mother/UserEmailMother';
import { Builder } from '../builder';
import { UserGithubCredentials } from '../../../../src/contexts/users/domain/UserGithubCredentials';
import { NumberMother } from '../../object-mother/NumberMother';
import { GithubId } from '../../../../src/contexts/users/domain/GithubId';

const generateValidPassword = () =>
  StringMother.random({
    minLength: UserPassword.MIN_LENGTH,
    casing: 'mixed',
    withSymbols: UserPassword.acceptedSymbols as PossibleSymbol[],
  });

export class UserBuilder implements Builder<User> {
  public nickname?: UserNickname;
  public credentials?: PossibleUserCredentials;
  public plainPassword?: string;

  public build(): User {
    const createdAt = DateMother.now();
    return new User({
      id: UserId.random(),
      nickname:
        this.nickname ||
        UserNickname.of(StringMother.random({ minLength: 8, maxLength: 10 })),
      credentials:
        this.credentials ||
        UserBasicCredentials.of({
          email: EmailMother.random(),
          password: UserPassword.new(generateValidPassword()),
        }),
      verified: false,
      createdAt: createdAt,
      updatedAt: createdAt,
    });
  }

  public aBasicCredentialsUser(): UserBuilder {
    this.credentials = UserBasicCredentials.of({
      email: EmailMother.random(),
      password: UserPassword.new(generateValidPassword()),
    });

    return this;
  }

  public aGoogleCredentialsUser(): UserBuilder {
    this.credentials = UserGoogleCredentials.of({
      googleId: GoogleId.of(StringMother.random()),
      email: EmailMother.random(),
    });

    return this;
  }

  public aGithubCredentialsUser(): UserBuilder {
    this.credentials = UserGithubCredentials.of({
      githubId: GithubId.of(NumberMother.random()),
    });

    return this;
  }

  withGoogleId(googleId: GoogleId) {
    if (this.credentials?.type !== 'GOOGLE') {
      throw new Error('Invalid use of builder');
    }

    this.credentials = UserGoogleCredentials.of({
      email: this.credentials.email,
      googleId,
    });

    return this;
  }

  withGithubId(githubId: GithubId) {
    if (this.credentials?.type !== 'GITHUB') {
      throw new Error('Invalid use of builder');
    }

    this.credentials = UserGithubCredentials.of({
      githubId,
    });

    return this;
  }

  withPlainPassword(plainPassword: string) {
    if (this.credentials?.type !== 'BASIC') {
      throw new Error('Invalid use of builder');
    }

    this.credentials = UserBasicCredentials.of({
      email: this.credentials.email,
      password: UserPassword.new(plainPassword),
    });

    return this;
  }

  public withCredentials(credentails: PossibleUserCredentials) {
    this.credentials = credentails;

    return this;
  }

  public withNickname(nickname: UserNickname): UserBuilder {
    this.nickname = nickname;

    return this;
  }
}
