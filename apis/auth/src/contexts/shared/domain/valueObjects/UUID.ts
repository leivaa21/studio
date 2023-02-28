import { ValueObject } from './ValueObject';
import validate from 'uuid-validate';
import { v4 as uuid } from 'uuid';
import { InvalidArgumentException } from '../exceptions/InvalidArgumentException';

export class UUID extends ValueObject<string> {
  static random(): UUID {
    return new UUID(uuid());
  }
  static of(value: string): UUID {
    return new this(value);
  }

  constructor(value: string) {
    super(value);
    this.ensureIsValidUUID(value);
  }

  private ensureIsValidUUID(id: string): void {
    if (!validate(id, 4))
      throw new InvalidArgumentException(this.constructor.name, id);
  }
}
