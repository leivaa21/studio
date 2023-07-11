import { ValueObject } from '@studio/commons';

export class OrderBy extends ValueObject<string> {
  constructor(value: string) {
    super(value);
  }
}
