import { InMemoryUserRepository } from '../../../../../../../src/contexts/users/infrastructure/persistance/InMemoryUserRepository';
import { UserBuilder } from '../../../../../../helpers/builders/user/UserBuilder';
import { SignInWithBasicCredentialsHandler } from '../../../../../../../src/contexts/users/application/queries/SignIn/SignInWithBasicCredentials';
import { InvalidCredentialsError } from '../../../../../../../src/contexts/users/domain/errors/InvalidCredentials';
import { StringMother } from '../../../../../../helpers/object-mother/StringMother';
import { generateValidPassword } from '../../../../../../helpers/lib/generateValidPassword';

describe('Sign In User with Basic Credentials', () => {
  it('Should validate a valid user', async () => {
    const password = generateValidPassword();
    const user = UserBuilder.aBasicCredentialsUser()
      .withPlainPassword(password)
      .build();

    const query = {
      email: user.email.value,
      password,
    };

    const userRepository = new InMemoryUserRepository([user]);

    const queryHandler = new SignInWithBasicCredentialsHandler(userRepository);

    const response = await queryHandler.execute(query);

    expect(response.email.value).toEqual(query.email);
  });

  it('Should throw invalid credentials error if non-existant user', async () => {
    const password = generateValidPassword();
    const user = UserBuilder.aBasicCredentialsUser()
      .withPlainPassword(password)
      .build();

    const query = {
      email: user.email.value,
      password,
    };

    const userRepository = new InMemoryUserRepository([]);

    const queryHandler = new SignInWithBasicCredentialsHandler(userRepository);

    await expect(() => queryHandler.execute(query)).rejects.toThrow(
      InvalidCredentialsError
    );
  });

  it('Should throw invalid credentials error if password do not match', async () => {
    const password = generateValidPassword();
    const user = UserBuilder.aBasicCredentialsUser()
      .withPlainPassword(password)
      .build();

    const query = {
      email: user.email.value,
      password: StringMother.random({ minLength: 10, maxLength: 16 }),
    };

    const userRepository = new InMemoryUserRepository([user]);

    const queryHandler = new SignInWithBasicCredentialsHandler(userRepository);

    await expect(() => queryHandler.execute(query)).rejects.toThrow(
      InvalidCredentialsError
    );
  });
});
