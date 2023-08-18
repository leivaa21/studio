import { UserEmail } from '../../../../../../../src/contexts/users/domain/UserEmail';
import { InMemoryUserRepository } from '../../../../../../../src/contexts/users/infrastructure/persistance/InMemoryUserRepository';
import { UserBuilder } from '../../../../../../helpers/builders/user/UserBuilder';
import { StringMother } from '../../../../../../helpers/object-mother/StringMother';
import { EmailMother } from '../../../../../../helpers/object-mother/UserEmailMother';
import { RegisterNewUserGoogleCredentials } from '../../../../../../../src/contexts/users/application/commands/RegisterNewUser/RegisterNewUserGoogleCredentials';
import { GoogleId } from '../../../../../../../src/contexts/users/domain/GoogleId';

describe('Register New User with Google Credentials', () => {
  it('Should create a valid user', async () => {
    const command = {
      email: EmailMother.random().value,
      googleId: StringMother.random(),
    };

    const userRepository = new InMemoryUserRepository([]);

    const useCase = new RegisterNewUserGoogleCredentials(userRepository);

    await useCase.execute(command);

    const user = await userRepository.findByEmail(UserEmail.of(command.email));

    expect(user).toBeDefined();
    expect(user?.nickname.value).toStrictEqual(command.email);
  });

  it('Should not create a user that is already registered', async () => {
    const googleId = GoogleId.of(StringMother.random());

    const alreadyPersistedUser = new UserBuilder()
      .aGoogleCredentialsUser()
      .withGoogleId(googleId)
      .build();

    const command = {
      googleId: googleId.value,
      email: (alreadyPersistedUser.email as UserEmail).value,
    };

    const userRepository = new InMemoryUserRepository([alreadyPersistedUser]);

    const useCase = new RegisterNewUserGoogleCredentials(userRepository);

    await useCase.execute(command);

    expect(userRepository.users.length).toBe(1);
  });
});
