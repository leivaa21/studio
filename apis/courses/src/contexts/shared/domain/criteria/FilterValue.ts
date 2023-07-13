import { ValueObject } from '@studio/commons';

export class FilterValue extends ValueObject<string | string[]> {
  constructor(value: string | string[]) {
    super(value);
  }
}
