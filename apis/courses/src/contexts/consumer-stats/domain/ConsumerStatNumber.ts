import { InvalidArgumentError, ValueObject } from '@studio/commons';

export class ConsumerStatNumber extends ValueObject<number> {
  static of(value: number): ConsumerStatNumber {
    if (value < 0) {
      throw new InvalidArgumentError(this.name, value.toString());
    }

    return new ConsumerStatNumber(value);
  }

  public decrease(): ConsumerStatNumber {
    return ConsumerStatNumber.of(this.value - 1);
  }

  public increase(): ConsumerStatNumber {
    return ConsumerStatNumber.of(this.value + 1);
  }
}
