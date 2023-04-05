import { Casing, faker } from '@faker-js/faker';
import { NumberMother } from './NumberMother';

type PossibleSymbol = '@' | '!' | '_' | '-' | '.' | '?' | '¡' | '¿' | '<' | '>';

type StringOptions = {
  maxLength?: number;
  minLength?: number;
  length?: number;
  casing?: Casing;
  withSymbols?: PossibleSymbol[];
};
export class StringMother {
  public static random(options?: StringOptions): string {
    const { maxLength, minLength, length, casing, withSymbols } = options || {};

    const count =
      length ||
      NumberMother.random({
        min: minLength || 4,
        max: maxLength || 12,
      });

    const randomGeneratedString = faker.random.alphaNumeric(count, { casing });

    if (!withSymbols) return randomGeneratedString;

    const selectedSymbol =
      withSymbols[NumberMother.random({ min: 0, max: withSymbols.length - 1 })];

    return randomGeneratedString.slice(1).concat(selectedSymbol);
  }
}
