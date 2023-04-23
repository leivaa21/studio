import { RegisterNewUserBasicCredentials } from '../../../../../../../src/contexts/users/application/commands/RegisterNewUser/RegisterNewUserBasicCredentials';
import { UserEmail } from '../../../../../../../src/contexts/users/domain/UserEmail';
import { InMemoryUserRepository } from '../../../../../../../src/contexts/users/infrastructure/persistance/InMemoryUserRepository';
import { InvalidUserError } from '../../../../../../../src/contexts/users/domain/errors/UserInvalid';
import { UserBuilder } from '../../../../../../helpers/builders/user/UserBuilder';
import { StringMother } from '../../../../../../helpers/object-mother/StringMother';
import { EmailMother } from '../../../../../../helpers/object-mother/UserEmailMother';
import { UserNickname } from '../../../../../../../src/contexts/users/domain/UserNickname';
import { InvalidNicknameError } from '@studio/commons';
import { generateValidPassword } from '../../../../../../helpers/lib/generateValidPassword';
import { generateValidNickname } from '../../../../../../helpers/lib/generateValidNickname';

describe('Register New User with Basic Credentials', () => {
  it('Should create a valid user', () => {
    const command = {
      nickname: generateValidNickname(),
      email: EmailMother.random().value,
      password: generateValidPassword(),
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
      nickname: StringMother.random({ length: UserNickname.MIN_LENGTH - 1 }),
      email: EmailMother.random().value,
      password: generateValidPassword(),
    };

    const userRepository = new InMemoryUserRepository([]);

    const useCase = new RegisterNewUserBasicCredentials(userRepository);

    await expect(() => useCase.execute(command)).rejects.toThrow(
      InvalidNicknameError
    );
  });
  it('Should not create a user with invalid nickname (larger than max)', async () => {
    const command = {
      nickname: StringMother.random({ length: UserNickname.MAX_LENGTH + 1 }),
      email: EmailMother.random().value,
      password: generateValidPassword(),
    };

    const userRepository = new InMemoryUserRepository([]);

    const useCase = new RegisterNewUserBasicCredentials(userRepository);

    await expect(() => useCase.execute(command)).rejects.toThrow(
      InvalidNicknameError
    );
  });
  it('Should not create a user with a nickname that is already in use', async () => {
    const command = {
      nickname: generateValidNickname(),
      email: EmailMother.random().value,
      password: generateValidPassword(),
    };

    const alreadyPersistedUser = new UserBuilder()
      .withNickname(command.nickname)
      .build();

    const userRepository = new InMemoryUserRepository([alreadyPersistedUser]);

    const useCase = new RegisterNewUserBasicCredentials(userRepository);

    await expect(() => useCase.execute(command)).rejects.toThrow(
      InvalidUserError
    );
  });
  it('Should not create a user with an email that is already in use', async () => {
    const command = {
      nickname: generateValidNickname(),
      email: EmailMother.random().value,
      password: generateValidPassword(),
    };

    const alreadyPersistedUser = new UserBuilder()
      .withEmail(command.email)
      .build();

    const userRepository = new InMemoryUserRepository([alreadyPersistedUser]);

    const useCase = new RegisterNewUserBasicCredentials(userRepository);

    await expect(() => useCase.execute(command)).rejects.toThrow(
      InvalidUserError
    );
  });
});
