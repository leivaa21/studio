import { InvalidArgumentError, ValueObject } from '@studio/commons';

export enum Operator {
  EQUAL = '=',
  NOT_EQUAL = '!=',
  GT = '>',
  LT = '<',
  CONTAINS = 'CONTAINS',
  NOT_CONTAINS = 'NOT_CONTAINS',
  INCLUDES = 'INCLUDES',
  EXISTS = 'EXISTS',
}

export class FilterOperator extends ValueObject<Operator> {
  constructor(value: Operator) {
    super(value);
  }

  static fromValue(value: string): FilterOperator {
    switch (value) {
      case Operator.EQUAL:
        return new FilterOperator(Operator.EQUAL);
      case Operator.NOT_EQUAL:
        return new FilterOperator(Operator.NOT_EQUAL);
      case Operator.GT:
        return new FilterOperator(Operator.GT);
      case Operator.LT:
        return new FilterOperator(Operator.LT);
      case Operator.CONTAINS:
        return new FilterOperator(Operator.CONTAINS);
      case Operator.NOT_CONTAINS:
        return new FilterOperator(Operator.NOT_CONTAINS);
      case Operator.INCLUDES:
        return new FilterOperator(Operator.INCLUDES);
      case Operator.EXISTS:
        return new FilterOperator(Operator.EXISTS);
      default:
        throw new InvalidArgumentError(FilterOperator.name, value);
    }
  }

  public isPositive(): boolean {
    return (
      this.value !== Operator.NOT_EQUAL && this.value !== Operator.NOT_CONTAINS
    );
  }

  static equal() {
    return this.fromValue(Operator.EQUAL);
  }

  protected throwErrorForInvalidValue(value: Operator): void {
    throw new InvalidArgumentError(FilterOperator.name, value);
  }
}
