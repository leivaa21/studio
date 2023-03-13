import { ValueObject } from '../../shared/domain/ValueObject';
export class Password extends ValueObject<string> {

  public static fromPrimitives(hash: string) {
    return new this(hash);
  }

  protected constructor(value: string) {
    super(value);
  }

}
