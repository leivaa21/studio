import bcrypt from 'bcrypt';
import { ValueObject } from '../../shared/domain/valueObjects/ValueObject';
export class UserPassword extends ValueObject<string> {
  public static new(value: string) {
    const hash = bcrypt.hashSync(value, 16);
    return new this(hash);
  }

  public static of(value: string): UserPassword {
    return UserPassword.new(value);
  }

  public static fromPrimitives(hash: string) {
    return new this(hash);
  }

  public doMatch(password: string) {
    return bcrypt.compareSync(password, this.value);
  }

  private constructor(value: string) {
    super(value);
  }
}
