import { User } from '../../../../src/contexts/users/domain/User';
import { UserBasicCredentials } from '../../../../src/contexts/users/domain/UserBasicCredentials';
import { UserEmail } from '../../../../src/contexts/users/domain/UserEmail';
import { UserId } from '../../../../src/contexts/users/domain/UserId';
import { UserNickname } from '../../../../src/contexts/users/domain/UserNickname';
import { UserPassword } from '../../../../src/contexts/users/domain/UserPassword';
import { DateMother } from '../../object-mother/DateMother';
import { StringMother } from '../../object-mother/StringMother';
import { EmailMother } from '../../object-mother/UserEmailMother';
import { Builder } from '../builder';

export class UserBuilder implements Builder<User> {
  public email?: string;
  public nickname?: string;
  public plainPassword?: string;

  public build(): User {
    const createdAt = DateMother.now();
    return new User({
      id: UserId.random(),
      nickname: UserNickname.of(
        this.nickname || StringMother.random({ minLength: 8, maxLength: 10 })
      ),
      credentials: UserBasicCredentials.of({
        email: this.email ? UserEmail.of(this.email) : EmailMother.random(),
        password: UserPassword.new(
          this.plainPassword ||
            StringMother.random({ minLength: 10, maxLength: 16 })
        ),
      }),
      verified: false,
      createdAt: createdAt,
      updatedAt: createdAt,
    });
  }
  public withEmail(email: string): UserBuilder {
    this.email = email;
    return this;
  }

  public withPlainPassword(plainPassword: string): UserBuilder {
    this.plainPassword = plainPassword;
    return this;
  }

  public withNickname(nickname: string): UserBuilder {
    this.nickname = nickname;
    return this;
  }
}
