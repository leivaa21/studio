import { mock } from 'jest-mock-extended';

import { InMemoryUserRepository } from '../../../../../../../src/contexts/users/infrastructure/persistance/InMemoryUserRepository';
import { UserBuilder } from '../../../../../../helpers/builders/user/UserBuilder';
import { InvalidCredentialsError } from '../../../../../../../src/contexts/users/domain/errors/InvalidCredentials';
import { StringMother } from '../../../../../../helpers/object-mother/StringMother';
import { GoogleId } from '../../../../../../../src/contexts/users/domain/GoogleId';
import { SignInWithGoogleCredentialsHandler } from '../../../../../../../src/contexts/users/application/queries/SignIn/SignInWithGoogleCredentials';
import { UserRepository } from '../../../../../../../src/contexts/users/domain/UserRepository';
import { RegisterNewUserGoogleCredentialsCommand } from '../../../../../../../src/contexts/users/application/commands/RegisterNewUser/RegisterNewUserGoogleCredentials';
import { EmailMother } from '../../../../../../helpers/object-mother/UserEmailMother';
import { UserEmail } from '../../../../../../../src/contexts/users/domain/UserEmail';
import { CommandBus } from '../../../../../../../src/contexts/shared/domain/CommandBus';

const commandBus = mock<CommandBus>();

describe('Sign In User with Google Credentials', () => {
  it('Should validate a valid user', async () => {
    const googleId = GoogleId.of(StringMother.random());
    const user = new UserBuilder()
      .aGoogleCredentialsUser()
      .withGoogleId(googleId)
      .build();

    const query = {
      email: (user.email as UserEmail).value,
      googleId: googleId.value,
    };

    const userRepository = new InMemoryUserRepository([user]);

    const queryHandler = new SignInWithGoogleCredentialsHandler(
      commandBus,
      userRepository
    );

    const response = await queryHandler.execute(query);

    expect((response.email as UserEmail).value).toEqual(query.email);
  });

  it('Should call commandBus if non-persisted user', async () => {
    const googleId = GoogleId.of(StringMother.random());
    const user = new UserBuilder()
      .aGoogleCredentialsUser()
      .withGoogleId(googleId)
      .build();

    const query = {
      email: (user.email as UserEmail).value,
      googleId: googleId.value,
    };
    const userRepository = mock<UserRepository>();

    const queryHandler = new SignInWithGoogleCredentialsHandler(
      commandBus,
      userRepository
    );

    userRepository.findByGoogleId.mockResolvedValueOnce(null);
    commandBus.dispatch.mockResolvedValue();
    userRepository.findByGoogleId.mockResolvedValueOnce(user);

    const response = await queryHandler.execute(query);

    expect(commandBus.dispatch).toHaveBeenCalledWith(
      new RegisterNewUserGoogleCredentialsCommand(query)
    );
    expect(userRepository.findByGoogleId).toHaveBeenCalledTimes(2);
    expect((response.email as UserEmail).value).toEqual(query.email);
  });

  it('Should not validate a invalid user', async () => {
    const googleId = GoogleId.of(StringMother.random());
    const user = new UserBuilder()
      .aGoogleCredentialsUser()
      .withGoogleId(googleId)
      .build();

    const query = {
      email: EmailMother.random().value,
      googleId: googleId.value,
    };

    const userRepository = new InMemoryUserRepository([user]);

    const queryHandler = new SignInWithGoogleCredentialsHandler(
      commandBus,
      userRepository
    );

    expect(queryHandler.execute(query)).rejects.toThrow(
      InvalidCredentialsError
    );
  });
});
