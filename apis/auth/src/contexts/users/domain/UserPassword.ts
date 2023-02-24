import bcrypt from 'bcrypt';
import { ValueObject } from '../../shared/domain/valueObjects/ValueObject';
export class UserPassword extends ValueObject<string> {
  static new(value: string) {
    const hash = bcrypt.hashSync(value, 16);
    return new this(hash);
  }
  static fromPrimitives(hash: string) {
    return new this(hash);
  }

  private constructor(value: string) {
    super(value);
  }

  doMatch(password: string) {
    return bcrypt.compareSync(password, this.value);
  }
}
