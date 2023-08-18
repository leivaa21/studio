import { UserGoogleCredentials } from '../../../../../../src/contexts/users/domain/UserGoogleCredentials';
import { UserRepository } from '../../../../../../src/contexts/users/domain/UserRepository';
import { UserBuilder } from '../../../../../helpers/builders/user/UserBuilder';
import { generateValidNickname } from '../../../../../helpers/lib/generateValidNickname';
import { mock, mockReset } from 'jest-mock-extended';
import { EmailMother } from '../../../../../helpers/object-mother/UserEmailMother';
import { GoogleId } from '../../../../../../src/contexts/users/domain/GoogleId';
import {
  RenameUser,
  RenameUserCommand,
} from '../../../../../../src/contexts/users/application/commands/RenameUser';
import { StringMother } from '../../../../../helpers/object-mother/StringMother';
import { UserBasicCredentials } from '../../../../../../src/contexts/users/domain/UserBasicCredentials';
import { UserPassword } from '../../../../../../src/contexts/users/domain/UserPassword';
import { generateValidPassword } from '../../../../../helpers/lib/generateValidPassword';
import { UserNickname } from '../../../../../../src/contexts/users/domain/UserNickname';
import { UnableToRenameUser } from '../../../../../../src/contexts/users/domain/errors/UnableToRenameUser';
import { UserNotFoundError } from '../../../../../../src/contexts/users/domain/errors/UserNotFound';

const userRepository = mock<UserRepository>();

describe('Rename a user', () => {
  beforeEach(() => {
    mockReset(userRepository);
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
      type: 'BASIC',
      credentials: UserBasicCredentials.of({
        email: EmailMother.random(),
        password: UserPassword.new(generateValidPassword()),
      }),
    },
  ])('Should rename a user with $type credentials', async ({ credentials }) => {
    const user = new UserBuilder().withCredentials(credentials).build();
    const command = new RenameUserCommand({
      userId: user.id.value,
      nickname: generateValidNickname(),
    });

    const useCase = new RenameUser(userRepository);

    userRepository.findById.mockResolvedValue(user);

    await expect(useCase.execute(command)).resolves.not.toThrow();
    expect(userRepository.update).toHaveBeenCalledWith(
      expect.objectContaining({
        id: user.id,
        nickname: UserNickname.of(command.nickname),
      })
    );
  });

  it('Should not rename a user with GITHUB credentials', async () => {
    const user = new UserBuilder().aGithubCredentialsUser().build();
    const command = new RenameUserCommand({
      userId: user.id.value,
      nickname: generateValidNickname(),
    });

    const useCase = new RenameUser(userRepository);

    userRepository.findById.mockResolvedValue(user);

    await expect(useCase.execute(command)).rejects.toThrow(UnableToRenameUser);
    expect(userRepository.update).not.toHaveBeenCalled();
  });

  it('Should not rename a user if user is not found', async () => {
    const user = new UserBuilder().aBasicCredentialsUser().build();
    const command = new RenameUserCommand({
      userId: user.id.value,
      nickname: generateValidNickname(),
    });

    const useCase = new RenameUser(userRepository);

    userRepository.findById.mockResolvedValue(null);

    await expect(useCase.execute(command)).rejects.toThrow(UserNotFoundError);
    expect(userRepository.update).not.toHaveBeenCalled();
  });
});
