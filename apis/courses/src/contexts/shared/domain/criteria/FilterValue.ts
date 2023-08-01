import { ValueObject } from '@studio/commons';

export class FilterValue extends ValueObject<string | string[] | boolean> {
  constructor(value: string | string[] | boolean) {
    super(value);
  }
}
