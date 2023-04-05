import { ValueObject } from '@studio/commons';

export class GoogleId extends ValueObject<string> {
  static of(value: string): GoogleId {
    return new GoogleId(value);
  }
}
