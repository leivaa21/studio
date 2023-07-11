import { FilterField } from './FilterField';
import { FilterOperator, Operator } from './FilterOperator';
import { FilterValue } from './FilterValue';
import { InvalidFilterError } from './errors/InvalidFilterError';

export interface FilterAsPrimitives {
  readonly field: string;
  readonly operator: Operator;
  readonly value: string;
}

export class Filter {
  constructor(
    public readonly field: FilterField,
    public readonly operator: FilterOperator,
    public readonly value: FilterValue
  ) {
    this.field = field;
    this.operator = operator;
    this.value = value;
  }

  static fromValues({ field, operator, value }: FilterAsPrimitives): Filter {
    if (!field || !operator || !value) {
      throw new InvalidFilterError(`The filter is invalid`);
    }

    return new Filter(
      new FilterField(field),
      FilterOperator.fromValue(operator),
      new FilterValue(value)
    );
  }
}
