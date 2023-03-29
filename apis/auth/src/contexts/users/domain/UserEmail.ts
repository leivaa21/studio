import { ValueObject } from '@studio/commons';

export class UserEmail extends ValueObject<string> {
  static of(value: string): UserEmail {
    return new UserEmail(value);
  }
}
