import { InMemoryUserRepository } from '../../../../../../../src/contexts/users/infrastructure/persistance/InMemoryUserRepository';
import { UserBuilder } from '../../../../../../helpers/builders/user/UserBuilder';
import { generateValidNickname } from '../../../../../../helpers/lib/generateValidNickname';
import { NumberMother } from '../../../../../../helpers/object-mother/NumberMother';
import { RegisterNewUserGithubCredentials } from '../../../../../../../src/contexts/users/application/commands/RegisterNewUser/RegisterNewUserGithubCredentials';
import { GithubId } from '../../../../../../../src/contexts/users/domain/GithubId';

describe('Register New User with Github Credentials', () => {
  it('Should create a valid user', async () => {
    const command = {
      name: generateValidNickname(),
      githubId: NumberMother.random(),
    };

    const userRepository = new InMemoryUserRepository([]);

    const useCase = new RegisterNewUserGithubCredentials(userRepository);

    await useCase.execute(command);

    const user = await userRepository.findByGithubId(
      GithubId.of(command.githubId)
    );

    expect(user).toBeDefined();
    expect(user?.nickname.value).toStrictEqual(command.name);
  });

  it('Should not create a user that is already registered', async () => {
    const githubId = GithubId.of(NumberMother.random());

    const alreadyPersistedUser = UserBuilder.aGithubCredentialsUser()
      .withGithubId(githubId)
      .build();

    const command = {
      name: alreadyPersistedUser.nickname.value,
      githubId: githubId.value,
    };

    const userRepository = new InMemoryUserRepository([alreadyPersistedUser]);

    const useCase = new RegisterNewUserGithubCredentials(userRepository);

    await useCase.execute(command);

    expect(userRepository.users.length).toBe(1);
  });
});
