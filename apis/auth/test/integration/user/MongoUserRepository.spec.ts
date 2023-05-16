import { StartedTestContainer } from 'testcontainers';

import {
  connectMongooseToContainer,
  disconnectMongoTest,
  initializeMongoContainer,
} from '../../helpers/test-containers/mongo';
import { UserBuilder } from '../../helpers/builders/user/UserBuilder';

import { MongoUserRepository } from '../../../src/contexts/users/infrastructure/persistance/mongo/MongoUserRepository';
import { UserSchemaFactory } from '../../../src/contexts/users/infrastructure/persistance/mongo/UserSchemaFactory';
import { UserRepository } from '../../../src/contexts/users/domain/UserRepository';
import { GoogleId } from '../../../src/contexts/users/domain/GoogleId';
import { StringMother } from '../../helpers/object-mother/StringMother';

describe('Mongo User Repository', () => {
  jest.setTimeout(9999999);

  let repository: UserRepository;
  let container: StartedTestContainer;

  beforeAll(async () => {
    repository = new MongoUserRepository(new UserSchemaFactory());
    container = await initializeMongoContainer();
    await connectMongooseToContainer(container);
  });

  afterAll(async () => {
    await disconnectMongoTest();
    await container.stop();
  });

  describe('Persisting User', () => {
    it('should let persist a basic credentials user and be able to find it', async () => {
      const user = UserBuilder.aBasicCredentialsUser().build();
      await repository.create(user);

      const userFound = await repository.findById(user.id);

      expect(userFound?.toPrimitives()).toStrictEqual(user.toPrimitives());
    });

    it('should let persist a Google Credentials user and be able to find it', async () => {
      const user = UserBuilder.aGoogleCredentialsUser().build();
      await repository.create(user);

      const userFound = await repository.findById(user.id);

      expect(userFound?.toPrimitives()).toStrictEqual(user.toPrimitives());
    });
  });

  describe('Find a user', () => {
    const basicCredentialsUser = UserBuilder.aBasicCredentialsUser().build();
    const googleId = GoogleId.of(StringMother.random());
    const googleCredentialsUser = UserBuilder.aGoogleCredentialsUser()
      .withGoogleId(googleId)
      .build();

    beforeAll(async () => {
      await repository.create(basicCredentialsUser);
      await repository.create(googleCredentialsUser);
    });

    describe('Should let find by email', () => {
      it('With basicCredentials', async () => {
        const user = await repository.findByEmail(basicCredentialsUser.email);

        expect(user?.toPrimitives()).toStrictEqual(
          basicCredentialsUser.toPrimitives()
        );
      });

      it('With googleCredentials', async () => {
        const user = await repository.findByEmail(googleCredentialsUser.email);

        expect(user?.toPrimitives()).toStrictEqual(
          googleCredentialsUser.toPrimitives()
        );
      });
    });

    it('Should let find by Nickname', async () => {
      const user = await repository.findByNickname(
        basicCredentialsUser.nickname
      );

      expect(user?.toPrimitives()).toStrictEqual(
        basicCredentialsUser.toPrimitives()
      );
    });

    it('Should let find by googleId (googleCredentials only)', async () => {
      const user = await repository.findByGoogleId(googleId);

      expect(user?.toPrimitives()).toStrictEqual(
        googleCredentialsUser.toPrimitives()
      );
    });
  });
});
