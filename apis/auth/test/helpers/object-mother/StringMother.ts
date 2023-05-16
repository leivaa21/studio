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

    let randomGeneratedString = '';

    if (casing === 'lower' || casing === 'mixed')
      randomGeneratedString = randomGeneratedString.concat('a');
    if (casing === 'upper' || casing === 'mixed')
      randomGeneratedString = randomGeneratedString.concat('A');
    if (!onlyAlpha) {
      randomGeneratedString = randomGeneratedString.concat(
        NumberMother.random({ min: 0, max: 9 }).toString()
      );
    }
    if (withSymbols) {
      const selectedSymbol =
        withSymbols[
          NumberMother.random({ min: 0, max: withSymbols.length - 1 })
        ];
      randomGeneratedString = randomGeneratedString.concat(selectedSymbol);
    }

    const targetLength =
      length ||
      NumberMother.random({
        min: minLength || 4,
        max: maxLength || 12,
      });

    const count = targetLength - randomGeneratedString.length;

    if (onlyAlpha)
      randomGeneratedString = randomGeneratedString.concat(
        faker.random.alpha({ count, casing })
      );
    else
      randomGeneratedString = randomGeneratedString.concat(
        faker.random.alphaNumeric(count, { casing })
      );

    return randomGeneratedString;
  }
}
