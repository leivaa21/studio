import { ValueObject } from '@studio/commons/dist/contexts/shared/domain/ValueObject';

export class UserEmail extends ValueObject<string> {
  static of(value: string): UserEmail {
    return new UserEmail(value);
  }
}
