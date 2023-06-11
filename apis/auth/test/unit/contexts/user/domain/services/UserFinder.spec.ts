import { UserFinder } from '../../../../../../src/contexts/users/domain/services/UserFinder';
import { InMemoryUserRepository } from '../../../../../../src/contexts/users/infrastructure/persistance/InMemoryUserRepository';
import { GoogleId } from '../../../../../../src/contexts/users/domain/GoogleId';
import { UserNotFoundError } from '../../../../../../src/contexts/users/domain/errors/UserNotFound';
import { UserBuilder } from '../../../../../helpers/builders/user/UserBuilder';
import { StringMother } from '../../../../../helpers/object-mother/StringMother';
import { EmailMother } from '../../../../../helpers/object-mother/UserEmailMother';
import { UserEmail } from '../../../../../../src/contexts/users/domain/UserEmail';

describe('User Finder', () => {
  it('Should be able to find user by id', async () => {
    // Given
    const user = UserBuilder.aBasicCredentialsUser().build();
    const repository = new InMemoryUserRepository([user]);
    const userFinder = new UserFinder(repository);

    // When
    const userFound = await userFinder.findByIdOrThrow(user.id);

    // Then
    expect(userFound).toStrictEqual(user);
  });

  it('Should throw if user not found by id', async () => {
    // Given
    const user = UserBuilder.aBasicCredentialsUser().build();
    const repository = new InMemoryUserRepository([]);
    const userFinder = new UserFinder(repository);

    // When Then
    expect(userFinder.findByIdOrThrow(user.id)).rejects.toThrow(
      UserNotFoundError
    );
  });

  it('Should be able to find user by email basic credentials', async () => {
    const user = UserBuilder.aBasicCredentialsUser().build();
    const repository = new InMemoryUserRepository([user]);
    const userFinder = new UserFinder(repository);

    const userFound = await userFinder.findByEmailOrThrow(
      user.email as UserEmail
    );

    expect(userFound).toStrictEqual(user);
  });

  it('Should be able to find user by email google credentials', async () => {
    const user = UserBuilder.aGoogleCredentialsUser().build();
    const repository = new InMemoryUserRepository([user]);
    const userFinder = new UserFinder(repository);

    const userFound = await userFinder.findByEmailOrThrow(
      user.email as UserEmail
    );

    expect(userFound).toStrictEqual(user);
  });

  it('Should throw if user by email was not found', async () => {
    const repository = new InMemoryUserRepository([]);
    const userFinder = new UserFinder(repository);

    expect(userFinder.findByEmailOrThrow(EmailMother.random())).rejects.toThrow(
      UserNotFoundError
    );
  });

  it('Should be able to find user by nickname', async () => {
    const user = UserBuilder.aBasicCredentialsUser().build();

    const repository = new InMemoryUserRepository([user]);
    const userFinder = new UserFinder(repository);

    const userFound = await userFinder.findByNicknameOrNull(user.nickname);

    expect(userFound).toStrictEqual(user);
  });

  it('Should return null if user by nickname was not found', async () => {
    const user = UserBuilder.aBasicCredentialsUser().build();

    const repository = new InMemoryUserRepository([]);
    const userFinder = new UserFinder(repository);

    const userFound = await userFinder.findByNicknameOrNull(user.nickname);

    expect(userFound).toStrictEqual(null);
  });

  it('Should be able to find user by googleId', async () => {
    const googleId = GoogleId.of(StringMother.random());
    const user = UserBuilder.aGoogleCredentialsUser()
      .withGoogleId(googleId)
      .build();

    const repository = new InMemoryUserRepository([user]);
    const userFinder = new UserFinder(repository);

    const userFound = await userFinder.findByGoogleIdOrThrow(googleId);

    expect(userFound).toStrictEqual(user);
  });

  it('Should throw if user by googleId was not found', async () => {
    const googleId = GoogleId.of(StringMother.random());

    const repository = new InMemoryUserRepository([]);
    const userFinder = new UserFinder(repository);

    expect(userFinder.findByGoogleIdOrThrow(googleId)).rejects.toThrow(
      UserNotFoundError
    );
  });
});
