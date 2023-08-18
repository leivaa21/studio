import { UserGoogleCredentials } from '../../../../../../src/contexts/users/domain/UserGoogleCredentials';
import { UserRepository } from '../../../../../../src/contexts/users/domain/UserRepository';
import { UserBuilder } from '../../../../../helpers/builders/user/UserBuilder';
import { mock, mockReset } from 'jest-mock-extended';
import { EmailMother } from '../../../../../helpers/object-mother/UserEmailMother';
import { GoogleId } from '../../../../../../src/contexts/users/domain/GoogleId';
import {
  ChangeEmail,
  ChangeEmailCommand,
} from '../../../../../../src/contexts/users/application/commands/ChangeEmail';
import { StringMother } from '../../../../../helpers/object-mother/StringMother';
import { UserNotFoundError } from '../../../../../../src/contexts/users/domain/errors/UserNotFound';
import { UserGithubCredentials } from '../../../../../../src/contexts/users/domain/UserGithubCredentials';
import { GithubId } from '../../../../../../src/contexts/users/domain/GithubId';
import { NumberMother } from '../../../../../helpers/object-mother/NumberMother';
import { UnableToChangeEmail } from '../../../../../../src/contexts/users/domain/errors/UnableToChangeEmail';
import { UserEmail } from '../../../../../../src/contexts/users/domain/UserEmail';

const userRepository = mock<UserRepository>();

describe('Change user email', () => {
  beforeEach(() => {
    mockReset(userRepository);
  });

  it('Should change email for a user with BASIC credentials', async () => {
    const user = new UserBuilder().aBasicCredentialsUser().build();
    const command = new ChangeEmailCommand({
      userId: user.id.value,
      email: EmailMother.random().value,
    });

    const useCase = new ChangeEmail(userRepository);

    userRepository.findById.mockResolvedValue(user);

    await expect(useCase.execute(command)).resolves.not.toThrow();
    expect(userRepository.update).toHaveBeenCalledWith(
      expect.objectContaining({
        id: user.id,
        email: UserEmail.of(command.email),
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
    'Should not let change email to a user with $type credentials',
    async ({ credentials }) => {
      const user = new UserBuilder().withCredentials(credentials).build();
      const command = new ChangeEmailCommand({
        userId: user.id.value,
        email: EmailMother.random().value,
      });

      const useCase = new ChangeEmail(userRepository);

      userRepository.findById.mockResolvedValue(user);

      await expect(useCase.execute(command)).rejects.toThrow(
        UnableToChangeEmail
      );
      expect(userRepository.update).not.toHaveBeenCalled();
    }
  );

  it('Should not change email to a user if user is not found', async () => {
    const user = new UserBuilder().aBasicCredentialsUser().build();
    const command = new ChangeEmailCommand({
      userId: user.id.value,
      email: EmailMother.random().value,
    });

    const useCase = new ChangeEmail(userRepository);

    userRepository.findById.mockResolvedValue(null);

    await expect(useCase.execute(command)).rejects.toThrow(UserNotFoundError);
    expect(userRepository.update).not.toHaveBeenCalled();
  });
});
