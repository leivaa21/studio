import { ValueObject } from '@studio/commons';

export class FilterValue extends ValueObject<string> {
  constructor(value: string) {
    super(value);
  }
}
