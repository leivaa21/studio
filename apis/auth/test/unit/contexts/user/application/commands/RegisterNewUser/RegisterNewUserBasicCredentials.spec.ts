import { RegisterNewUserBasicCredentials } from '../../../../../../../src/contexts/users/application/commands/RegisterNewUser/RegisterNewUserBasicCredentials';
import { UserEmail } from '../../../../../../../src/contexts/users/domain/UserEmail';
import { InMemoryUserRepository } from '../../../../../../../src/contexts/users/infrastructure/persistance/InMemoryUserRepository';
import { InvalidUserException } from '../../../../../../../src/contexts/users/domain/exceptions/UserInvalid';
import { UserBuilder } from '../../../../../../helpers/builders/user/UserBuilder';
import { StringMother } from '../../../../../../helpers/object-mother/StringMother';
import { EmailMother } from '../../../../../../helpers/object-mother/UserEmailMother';
import { InvalidUserNickname } from '../../../../../../../src/contexts/users/domain/exceptions/InvalidUserNickname';
import { UserNickname } from '../../../../../../../src/contexts/users/domain/UserNickname';

describe('Register New User with Basic Credentials', () => {
  it('Should create a valid user', () => {
    const command = {
      nickname: StringMother.random({
        maxLength: UserNickname.MAX_LENGTH,
        minLength: UserNickname.MIN_LENGTH,
      }),
      email: EmailMother.random().value,
      password: StringMother.random({ maxLength: 16, minLength: 10 }),
    };

    const userRepository = new InMemoryUserRepository([]);

    const useCase = new RegisterNewUserBasicCredentials(userRepository);

    useCase.execute(command);

    expect(
      userRepository.findByEmail(UserEmail.of(command.email))
    ).toBeDefined();
  });
  it('Should not create a user with invalid nickname (shorter than min)', async () => {
    const command = {
      nickname: StringMother.random({ maxLength: 2, minLength: 1 }),
      email: EmailMother.random().value,
      password: StringMother.random({ maxLength: 16, minLength: 10 }),
    };

    const userRepository = new InMemoryUserRepository([]);

    const useCase = new RegisterNewUserBasicCredentials(userRepository);

    await expect(() => useCase.execute(command)).rejects.toThrow(
      InvalidUserNickname
    );
  });
  it('Should not create a user with invalid nickname (larger than max)', async () => {
    const command = {
      nickname: StringMother.random({ maxLength: 20, minLength: 17 }),
      email: EmailMother.random().value,
      password: StringMother.random({ maxLength: 16, minLength: 10 }),
    };

    const userRepository = new InMemoryUserRepository([]);

    const useCase = new RegisterNewUserBasicCredentials(userRepository);

    await expect(() => useCase.execute(command)).rejects.toThrow(
      InvalidUserNickname
    );
  });
  it('Should not create a user with a nickname that is already in use', async () => {
    const command = {
      nickname: StringMother.random({
        maxLength: UserNickname.MAX_LENGTH,
        minLength: UserNickname.MIN_LENGTH,
      }),
      email: EmailMother.random().value,
      password: StringMother.random({ maxLength: 16, minLength: 10 }),
    };

    const alreadyPersistedUser = new UserBuilder()
      .withNickname(command.nickname)
      .build();

    const userRepository = new InMemoryUserRepository([alreadyPersistedUser]);

    const useCase = new RegisterNewUserBasicCredentials(userRepository);

    await expect(() => useCase.execute(command)).rejects.toThrow(
      InvalidUserException
    );
  });
  it('Should not create a user with an email that is already in use', async () => {
    const command = {
      nickname: StringMother.random({
        maxLength: UserNickname.MAX_LENGTH,
        minLength: UserNickname.MIN_LENGTH,
      }),
      email: EmailMother.random().value,
      password: StringMother.random({ maxLength: 16, minLength: 10 }),
    };

    const alreadyPersistedUser = new UserBuilder()
      .withEmail(command.email)
      .build();

    const userRepository = new InMemoryUserRepository([alreadyPersistedUser]);

    const useCase = new RegisterNewUserBasicCredentials(userRepository);

    await expect(() => useCase.execute(command)).rejects.toThrow(
      InvalidUserException
    );
  });
});
