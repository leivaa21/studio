import { mock } from 'jest-mock-extended';

import { InMemoryUserRepository } from '../../../../../../../src/contexts/users/infrastructure/persistance/InMemoryUserRepository';
import { UserBuilder } from '../../../../../../helpers/builders/user/UserBuilder';
import { UserRepository } from '../../../../../../../src/contexts/users/domain/UserRepository';
import { NumberMother } from '../../../../../../helpers/object-mother/NumberMother';
import { GithubId } from '../../../../../../../src/contexts/users/domain/GithubId';
import { SignInWithGithubCredentialsHandler } from '../../../../../../../src/contexts/users/application/queries/SignIn/SignInWithGithubCredentials';
import { RegisterNewUserGithubCredentialsCommand } from '../../../../../../../src/contexts/users/application/commands/RegisterNewUser/RegisterNewUserGithubCredentials';
import { CommandBus } from '../../../../../../../src/contexts/shared/domain/CommandBus';

const commandBus = mock<CommandBus>();

describe('Sign In User with Github Credentials', () => {
  it('Should validate a valid user', async () => {
    const githubId = GithubId.of(NumberMother.random());
    const user = new UserBuilder()
      .aGithubCredentialsUser()
      .withGithubId(githubId)
      .build();

    const query = {
      name: user.nickname.value,
      githubId: githubId.value,
    };

    const userRepository = new InMemoryUserRepository([user]);

    const queryHandler = new SignInWithGithubCredentialsHandler(
      commandBus,
      userRepository
    );

    const response = await queryHandler.execute(query);

    expect(response.nickname.value).toEqual(query.name);
  });

  it('Should call commandBus if non-persisted user', async () => {
    const githubId = GithubId.of(NumberMother.random());
    const user = new UserBuilder()
      .aGithubCredentialsUser()
      .withGithubId(githubId)
      .build();

    const query = {
      name: user.nickname.value,
      githubId: githubId.value,
    };

    const userRepository = mock<UserRepository>();

    const queryHandler = new SignInWithGithubCredentialsHandler(
      commandBus,
      userRepository
    );

    userRepository.findByGithubId.mockResolvedValueOnce(null);
    commandBus.dispatch.mockResolvedValue();
    userRepository.findByGithubId.mockResolvedValueOnce(user);

    const response = await queryHandler.execute(query);

    expect(commandBus.dispatch).toHaveBeenCalledWith(
      new RegisterNewUserGithubCredentialsCommand(query)
    );
    expect(userRepository.findByGithubId).toHaveBeenCalledTimes(2);
    expect(response.nickname.value).toEqual(query.name);
  });
});
