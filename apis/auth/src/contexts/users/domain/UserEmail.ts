import { ValueObject } from '@studio/commons';

export class UserEmail extends ValueObject<string> {
  constructor(value: string) {
    super(value.toLowerCase());
  }

  static of(value: string): UserEmail {
    return new UserEmail(value);
  }
}
