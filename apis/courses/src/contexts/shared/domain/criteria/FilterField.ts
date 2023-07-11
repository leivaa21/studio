import { ValueObject } from '@studio/commons';

export class FilterField extends ValueObject<string> {
  constructor(value: string) {
    super(value);
  }
}
