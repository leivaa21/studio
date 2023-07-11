import { InvalidArgumentError, ValueObject } from '@studio/commons';

export enum OrderTypes {
  ASC = 'asc',
  DESC = 'desc',
  NONE = 'none',
}

export class OrderType extends ValueObject<OrderTypes> {
  constructor(value: OrderTypes) {
    super(value);
  }

  static fromValue(value: string): OrderType {
    switch (value) {
      case OrderTypes.ASC:
        return new OrderType(OrderTypes.ASC);
      case OrderTypes.DESC:
        return new OrderType(OrderTypes.DESC);
      default:
        throw new InvalidArgumentError(OrderType.name, value);
    }
  }

  public isNone(): boolean {
    return this.value === OrderTypes.NONE;
  }

  public isAsc(): boolean {
    return this.value === OrderTypes.ASC;
  }

  protected throwErrorForInvalidValue(value: OrderTypes): void {
    throw new InvalidArgumentError(OrderType.name, value);
  }
}
