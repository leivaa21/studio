import { ValueObject } from './ValueObject';

export class Email extends ValueObject<string> {

  public static of(value: string): Email {
    return new Email(value);
  }

}
