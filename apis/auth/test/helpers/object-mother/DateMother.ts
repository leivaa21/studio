import { faker } from '@faker-js/faker';

export class DateMother {
  public static now(): Date {
    return new Date();
  }
  public static recent(): Date {
    return faker.date.recent();
  }
  public static future(): Date {
    return faker.date.future();
  }
}
