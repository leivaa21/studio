import bcrypt from 'bcrypt';
import { Password } from '@studio/commons';

export class UserPassword extends Password {
  public static new(value: string) {
    const hash = bcrypt.hashSync(value, 16);
    return new this(hash);
  }

  public static of(value: string): UserPassword {
    return new UserPassword(value);
  }

  public doMatch(password: string) {
    return bcrypt.compareSync(password, this.value);
  }
}
