import { InvalidArgumentError, ValueObject } from '@studio/commons';

export class LessonOrder extends ValueObject<number> {
  public static of(value: number): LessonOrder {
    this.verifyIsPositive(value);
    return new LessonOrder(value);
  }

  public static verifyIsPositive(value: number): void {
    if (value < 0) throw new InvalidArgumentError(this.name, value.toString());
  }
}
