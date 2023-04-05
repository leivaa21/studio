import { Casing, faker } from '@faker-js/faker';
import { NumberMother } from './NumberMother';

export type PossibleSymbol =
  | '@'
  | '!'
  | '_'
  | '-'
  | '.'
  | '?'
  | '¡'
  | '¿'
  | '<'
  | '>'
  | ' ';

type StringOptions = {
  maxLength?: number;
  minLength?: number;
  length?: number;
  casing?: Casing;
  withSymbols?: PossibleSymbol[];
  onlyAlpha?: boolean;
};
export class StringMother {
  public static random(options?: StringOptions): string {
    const { maxLength, minLength, length, casing, withSymbols, onlyAlpha } =
      options || {};

    const count =
      length ||
      NumberMother.random({
        min: minLength || 4,
        max: maxLength || 12,
      });
    let randomGeneratedString: string;

    // If there's no symbols, generate the string normally
    if (!withSymbols) {
      if (onlyAlpha)
        randomGeneratedString = faker.random.alpha({ count, casing });
      else randomGeneratedString = faker.random.alphaNumeric(count, { casing });

      return randomGeneratedString;
    }

    // If there's symbols, generate the string 1 character less than requested
    // (to concat the symbol later)
    if (onlyAlpha)
      randomGeneratedString = faker.random.alpha({ count: count - 1, casing });
    else
      randomGeneratedString = faker.random.alphaNumeric(count - 1, { casing });

    const selectedSymbol =
      withSymbols[NumberMother.random({ min: 0, max: withSymbols.length - 1 })];

    return randomGeneratedString.concat(selectedSymbol);
  }
}
