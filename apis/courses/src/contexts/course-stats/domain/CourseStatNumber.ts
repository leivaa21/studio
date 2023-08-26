import { InvalidArgumentError, ValueObject } from '@studio/commons';

export class CourseStatNumber extends ValueObject<number> {
  static of(value: number): CourseStatNumber {
    if (value < 0) {
      throw new InvalidArgumentError(this.name, value.toString());
    }

    return new CourseStatNumber(value);
  }

  public decrease(): CourseStatNumber {
    return CourseStatNumber.of(this.value - 1);
  }

  public increase(): CourseStatNumber {
    return CourseStatNumber.of(this.value + 1);
  }
}
