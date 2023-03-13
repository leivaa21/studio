import { UndefinedArgumentException } from './exceptions/UndefinedArgumentException';

export type Primitives = string | number | boolean | Date;

export class ValueObject<T extends Primitives> {
  
  public constructor(public readonly value: T) {
    if (value === null || value === undefined) {
      throw new UndefinedArgumentException(this.constructor.name);
    }
  }

  public equals(other: ValueObject<T>): boolean {
    return (
      other.constructor.name === this.constructor.name &&
      other.value === this.value
    );
  }

  public toString(): string {
    return this.value.toString();
  }
}
