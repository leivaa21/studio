import { faker } from '@faker-js/faker';
import { UserEmail } from '../../../src/contexts/users/domain/UserEmail';

export class EmailMother {
  public static random(): UserEmail {
    return UserEmail.of(faker.internet.email());
  }
  public static createOf(email: string): UserEmail {
    return UserEmail.of(email);
  }
}
