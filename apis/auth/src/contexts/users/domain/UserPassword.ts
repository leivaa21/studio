import bcrypt from 'bcrypt';

import { Password } from '@studio/commons';

export class UserPassword extends Password {
  public static new(value: string): UserPassword {
    this.assertIsSecure(value);
    const hash = bcrypt.hashSync(value, 12);
    return new this(hash);
  }
  public doMatch(password: string): boolean {
    return bcrypt.compareSync(password, this.value);
  }

  static of(value: string): UserPassword {
    return new UserPassword(value);
  }
}
