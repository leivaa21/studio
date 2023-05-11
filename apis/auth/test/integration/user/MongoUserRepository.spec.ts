import mongoose from 'mongoose';
import { StartedTestContainer } from 'testcontainers';

import {
  connectMongooseToContainer,
  disconnectMongoTest,
  initializeMongoContainer,
} from '../../helpers/test-containers/mongo';
import { UserBuilder } from '../../helpers/builders/user/UserBuilder';

import { MongoUserRepository } from '../../../src/contexts/users/infrastructure/persistance/mongo/MongoUserRepository';
import { UserSchemaFactory } from '../../../src/contexts/users/infrastructure/persistance/mongo/UserSchemaFactory';
import { UserRepository } from '../../contexts/users/domain/UserRepository';

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
    await disconnectMongoTest(mongoose);
    await container.stop();
  });

  it('should let persist an user and be able to find it', async () => {
    const user = UserBuilder.aBasicCredentialsUser().build();
    await repository.create(user);

    const userFound = await repository.findById(user.id);

    expect(userFound?.toPrimitives()).toStrictEqual(user.toPrimitives());
  });
});
