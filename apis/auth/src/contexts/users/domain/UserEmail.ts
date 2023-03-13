import { ValueObject } from '../../shared/domain/valueObjects/ValueObject';

export class UserEmail extends ValueObject<string> {
  public static of(value: string): UserEmail {
    return new UserEmail(value);
  }
}
