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

  private constructor({
    nickname,
    credentials,
  }: {
    nickname?: UserNickname;
    credentials?: PossibleUserCredentials;
  }) {
    this.nickname = nickname;
    this.credentails = credentials;
  }

  public credentails?: PossibleUserCredentials;

  public build(): User {
    const createdAt = DateMother.now();
    return new User({
      id: UserId.random(),
      nickname:
        this.nickname ||
        UserNickname.of(StringMother.random({ minLength: 8, maxLength: 10 })),
      credentials:
        this.credentails ||
        UserBasicCredentials.of({
          email: EmailMother.random(),
          password: UserPassword.new(generateValidPassword()),
        }),
      verified: false,
      createdAt: createdAt,
      updatedAt: createdAt,
    });
  }

  public static aBasicCredentialsUser() {
    return new this({
      credentials: UserBasicCredentials.of({
        email: EmailMother.random(),
        password: UserPassword.new(generateValidPassword()),
      }),
    });
  }

  public static aGoogleCredentialsUser() {
    return new this({
      credentials: UserGoogleCredentials.of({
        googleId: GoogleId.of(StringMother.random()),
        email: EmailMother.random(),
      }),
    });
  }

  public static aGithubCredentialsUser() {
    return new this({
      credentials: UserGithubCredentials.of({
        githubId: GithubId.of(NumberMother.random()),
      }),
    });
  }

  withGoogleId(googleId: GoogleId) {
    if (this.credentails?.type !== 'GOOGLE') {
      throw new Error('Invalid use of builder');
    }

    this.credentails = UserGoogleCredentials.of({
      email: this.credentails.email,
      googleId,
    });

    return this;
  }

  withGithubId(githubId: GithubId) {
    if (this.credentails?.type !== 'GITHUB') {
      throw new Error('Invalid use of builder');
    }

    this.credentails = UserGithubCredentials.of({
      githubId,
    });

    return this;
  }

  withPlainPassword(plainPassword: string) {
    if (this.credentails?.type !== 'BASIC') {
      throw new Error('Invalid use of builder');
    }

    this.credentails = UserBasicCredentials.of({
      email: this.credentails.email,
      password: UserPassword.new(plainPassword),
    });

    return this;
  }

  public withCredentials(credentails: PossibleUserCredentials) {
    this.credentails = credentails;

    return this;
  }

  public withNickname(nickname: UserNickname): UserBuilder {
    this.nickname = nickname;

    return this;
  }
}
