import { InvalidArgumentError, ValueObject } from '@studio/commons';

export class LessonOrder extends ValueObject<number> {
  public static of(value: number): LessonOrder {
    this.verifyIsPositive(value);
    return new LessonOrder(value);
  }

  public get isFirst(): boolean {
    return this.value === 0;
  }

  public static previousOf(order: LessonOrder): LessonOrder {
    return LessonOrder.of(order.value - 1);
  }

  public static posteriorOf(order: LessonOrder): LessonOrder {
    return LessonOrder.of(order.value + 1);
  }

  public static verifyIsPositive(value: number): void {
    if (value < 0) throw new InvalidArgumentError(this.name, value.toString());
  }
}
