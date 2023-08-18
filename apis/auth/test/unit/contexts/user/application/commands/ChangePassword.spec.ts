import { UserGoogleCredentials } from '../../../../../../src/contexts/users/domain/UserGoogleCredentials';
import { UserRepository } from '../../../../../../src/contexts/users/domain/UserRepository';
import { UserBuilder } from '../../../../../helpers/builders/user/UserBuilder';
import { mock, mockReset } from 'jest-mock-extended';
import { EmailMother } from '../../../../../helpers/object-mother/UserEmailMother';
import { GoogleId } from '../../../../../../src/contexts/users/domain/GoogleId';
import {
  ChangePassword,
  ChangePasswordCommand,
} from '../../../../../../src/contexts/users/application/commands/ChangePassword';
import { StringMother } from '../../../../../helpers/object-mother/StringMother';
import { UserNotFoundError } from '../../../../../../src/contexts/users/domain/errors/UserNotFound';
import { UserGithubCredentials } from '../../../../../../src/contexts/users/domain/UserGithubCredentials';
import { GithubId } from '../../../../../../src/contexts/users/domain/GithubId';
import { NumberMother } from '../../../../../helpers/object-mother/NumberMother';
import { generateValidPassword } from '../../../../../helpers/lib/generateValidPassword';
import { UnableToChangePassword } from '../../../../../../src/contexts/users/domain/errors/UnableToChangePassword';
import { InvalidCredentialsError } from '../../../../../../src/contexts/users/domain/errors/InvalidCredentials';

const userRepository = mock<UserRepository>();

describe('Change user password', () => {
  beforeEach(() => {
    mockReset(userRepository);
  });

  it('Should change password for a user with BASIC credentials', async () => {
    const oldPassword = generateValidPassword();
    const user = new UserBuilder()
      .aBasicCredentialsUser()
      .withPlainPassword(oldPassword)
      .build();

    const command = new ChangePasswordCommand({
      userId: user.id.value,
      password: oldPassword,
      newPassword: generateValidPassword(),
    });

    const useCase = new ChangePassword(userRepository);

    userRepository.findById.mockResolvedValue(user);

    await expect(useCase.execute(command)).resolves.not.toThrow();
    expect(userRepository.update).toHaveBeenCalledWith(
      expect.objectContaining({
        id: user.id,
      })
    );
  });

  it.each([
    {
      type: 'GOOGLE',
      credentials: UserGoogleCredentials.of({
        googleId: GoogleId.of(StringMother.random()),
        email: EmailMother.random(),
      }),
    },
    {
      type: 'GITHUB',
      credentials: UserGithubCredentials.of({
        githubId: GithubId.of(NumberMother.random()),
      }),
    },
  ])(
    'Should not let change password to a user with $type credentials',
    async ({ credentials }) => {
      const user = new UserBuilder().withCredentials(credentials).build();
      const command = new ChangePasswordCommand({
        userId: user.id.value,
        newPassword: generateValidPassword(),
        password: generateValidPassword(),
      });

      const useCase = new ChangePassword(userRepository);

      userRepository.findById.mockResolvedValue(user);

      await expect(useCase.execute(command)).rejects.toThrow(
        UnableToChangePassword
      );
      expect(userRepository.update).not.toHaveBeenCalled();
    }
  );

  it('Should not change password to a user if user is not found', async () => {
    const oldPassword = generateValidPassword();
    const user = new UserBuilder()
      .aBasicCredentialsUser()
      .withPlainPassword(oldPassword)
      .build();

    const command = new ChangePasswordCommand({
      userId: user.id.value,
      password: oldPassword,
      newPassword: generateValidPassword(),
    });

    const useCase = new ChangePassword(userRepository);

    userRepository.findById.mockResolvedValue(null);

    await expect(useCase.execute(command)).rejects.toThrow(UserNotFoundError);
    expect(userRepository.update).not.toHaveBeenCalled();
  });

  it('Should not change password to a user if old password is not correct', async () => {
    const user = new UserBuilder().aBasicCredentialsUser().build();

    const command = new ChangePasswordCommand({
      userId: user.id.value,
      password: generateValidPassword(),
      newPassword: generateValidPassword(),
    });

    const useCase = new ChangePassword(userRepository);

    userRepository.findById.mockResolvedValue(user);

    await expect(useCase.execute(command)).rejects.toThrow(
      InvalidCredentialsError
    );
    expect(userRepository.update).not.toHaveBeenCalled();
  });
});
