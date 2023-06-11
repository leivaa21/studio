import request from 'supertest';
import { StartedTestContainer } from 'testcontainers';
import { DependencyContainer } from '@studio/dependency-injection';
import { ErrorCodes } from '@studio/commons';

import {
  disconnectMongoTest,
  initializeMongoContainer,
} from '../../helpers/test-containers/mongo';
import { connectMongooseToContainer } from '../../helpers/test-containers/mongo';
import { generateValidPassword } from '../../helpers/lib/generateValidPassword';

import { app } from '../../../src/api/app';
import { UserRepository } from '../../../src/contexts/users/domain/UserRepository';
import { MongoUserRepository } from '../../../src/contexts/users/infrastructure/persistance/mongo/MongoUserRepository';
import { UserBuilder } from '../../helpers/builders/user/UserBuilder';
import { EmailMother } from '../../helpers/object-mother/UserEmailMother';

let mongoContainer: StartedTestContainer;
const repository = DependencyContainer.get<UserRepository>(MongoUserRepository);
const route = '/auth/signin/basic';

beforeAll(async () => {
  mongoContainer = await initializeMongoContainer();
  connectMongooseToContainer(mongoContainer);
});

afterAll(async () => {
  await disconnectMongoTest();
  await mongoContainer.stop();
});

describe(`POST ${route}`, () => {
  it('should return user & token if credentials match', async () => {
    const password = generateValidPassword();
    const persistedUser = UserBuilder.aBasicCredentialsUser()
      .withPlainPassword(password)
      .build();
    await repository.create(persistedUser);

    const response = await request(app)
      .post('/auth/signin/basic')
      .send({
        email: persistedUser.email?.value,
        password: password,
      })
      .expect('Content-Type', /json/)
      .expect(200);

    const { user, token } = response.body;

    expect(user).toStrictEqual({
      id: persistedUser.id.value,
      nickname: persistedUser.nickname.value,
    });
    expect(token).toBeDefined();
  });

  it('should return with 400 and expected error code if password is wrong', async () => {
    const password = generateValidPassword();
    const persistedUser = UserBuilder.aBasicCredentialsUser()
      .withPlainPassword(password)
      .build();
    await repository.create(persistedUser);

    const response = await request(app)
      .post('/auth/signin/basic')
      .send({
        email: persistedUser.email?.value,
        password: generateValidPassword(),
      })
      .expect('Content-Type', /json/)
      .expect(400);

    const { body } = response;

    expect(body.errorCode).toBe(ErrorCodes.InvalidCredential);
  });

  it('should return with 400 and expected error code if email is wrong', async () => {
    const password = generateValidPassword();
    const persistedUser = UserBuilder.aBasicCredentialsUser()
      .withPlainPassword(password)
      .build();
    await repository.create(persistedUser);

    const response = await request(app)
      .post('/auth/signin/basic')
      .send({
        email: EmailMother.random().value,
        password: password,
      })
      .expect('Content-Type', /json/)
      .expect(400);

    const { body } = response;

    expect(body.errorCode).toBe(ErrorCodes.InvalidCredential);
  });

  it('should return with 400 and expected error code any params missing', async () => {
    const password = generateValidPassword();
    const persistedUser = UserBuilder.aBasicCredentialsUser()
      .withPlainPassword(password)
      .build();
    await repository.create(persistedUser);

    const response = await request(app)
      .post('/auth/signin/basic')
      .send({
        email: EmailMother.random().value,
      })
      .expect('Content-Type', /json/)
      .expect(400);

    const { body } = response;

    // This probably should be an ErrorCode.MissingParameters or something like that
    expect(body.errorCode).toBe(ErrorCodes.InvalidCredential);
  });
});
