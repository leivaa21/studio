import { faker } from '@faker-js/faker';
import { NumberMother } from './NumberMother';

type StringOptions = {
  maxLength?: number;
  minLength?: number;
};
export class StringMother {
  public static random(options?: StringOptions): string {
    const { maxLength, minLength } = options || {};
    const count = NumberMother.random({
      min: minLength || 4,
      max: maxLength || 12,
    });
    return faker.random.alphaNumeric(count);
  }
}
