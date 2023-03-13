import bcrypt from 'bcrypt';
import { Password } from '@studio/commons/dist/contexts/user/domain/Password';

export class UserPassword extends Password {
  public static new(value: string) {
    const hash = bcrypt.hashSync(value, 16);
    return new this(hash);
  }

  public static of(value: string): UserPassword {
    return UserPassword.new(value);
  }

  public doMatch(password: string) {
    return bcrypt.compareSync(password, this.value);
  }
}
