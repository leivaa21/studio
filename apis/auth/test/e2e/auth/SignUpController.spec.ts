import request from 'supertest';
import { StartedTestContainer } from 'testcontainers';
import { DependencyContainer } from '@studio/dependency-injection';
import { ErrorCodes, Nickname } from '@studio/commons';

import {
  disconnectMongoTest,
  initializeMongoContainer,
} from '../../helpers/test-containers/mongo';
import { connectMongooseToContainer } from '../../helpers/test-containers/mongo';
import { generateValidPassword } from '../../helpers/lib/generateValidPassword';
import { UserBuilder } from '../../helpers/builders/user/UserBuilder';
import { EmailMother } from '../../helpers/object-mother/UserEmailMother';
import { generateValidNickname } from '../../helpers/lib/generateValidNickname';
import { StringMother } from '../../helpers/object-mother/StringMother';

import { app } from '../../../src/api/app';
import { UserRepository } from '../../../src/contexts/users/domain/UserRepository';
import { MongoUserRepository } from '../../../src/contexts/users/infrastructure/persistance/mongo/MongoUserRepository';
import { UserNickname } from '../../../src/contexts/users/domain/UserNickname';

let mongoContainer: StartedTestContainer;
const repository = DependencyContainer.get<UserRepository>(MongoUserRepository);
const route = '/auth/signup/basic';

beforeAll(async () => {
  mongoContainer = await initializeMongoContainer();
  connectMongooseToContainer(mongoContainer);
});

afterAll(async () => {
  await disconnectMongoTest();
  await mongoContainer.stop();
});

describe(`POST ${route}`, () => {
  it('should return user & token if is a valid register', async () => {
    const password = generateValidPassword();
    const email = EmailMother.random();
    const nickname = UserNickname.of(generateValidNickname());

    const response = await request(app)
      .post(route)
      .send({
        credentials: {
          password,
          email: email.value,
        },
        nickname: nickname.value,
      })
      .expect('Content-Type', /json/)
      .expect(201);

    const { user, token } = response.body;

    const userPersisted = await repository.findByNickname(nickname);

    expect(userPersisted).toBeDefined();

    expect(user.id).toBe(userPersisted?.id.value);
    expect(user.nickname).toBe(nickname.value);
    expect(token).toBeDefined();
  });

  it('should return with 400 and expected error code if password is invalid', async () => {
    const password = 'aafsf234s_';
    const email = EmailMother.random();
    const nickname = UserNickname.of(generateValidNickname());

    const response = await request(app)
      .post(route)
      .send({
        credentials: {
          email: email.value,
          password,
        },
        nickname: nickname.value,
      })
      .expect('Content-Type', /json/)
      .expect(400);

    const { body } = response;

    expect(body.errorCode).toBe(ErrorCodes.PasswordShouldContainUppercase);
  });

  it('should return with 400 and expected error code if nickname is invalid', async () => {
    const password = generateValidPassword();
    const email = EmailMother.random();
    const nickname = 'aaaaaaaaaaaaaaaaaaaaaaaa';

    const response = await request(app)
      .post(route)
      .send({
        credentials: {
          email: email.value,
          password,
        },
        nickname: nickname,
      })
      .expect('Content-Type', /json/);

    const { body } = response;
    console.log(body.user);

    expect(body.errorCode).toBe(ErrorCodes.InvalidNickname);
  });

  it('should return with 400 and expected error code if email is invalid', async () => {
    const password = generateValidPassword();
    const email = StringMother.random();
    const nickname = UserNickname.of(generateValidNickname());

    const response = await request(app)
      .post(route)
      .send({
        credentials: {
          email: email,
          password,
        },
        nickname: nickname.value,
      })
      .expect('Content-Type', /json/)
      .expect(400);

    const { body } = response;

    expect(body.errorCode).toBe(ErrorCodes.InvalidEmail);
  });

  it('should return with 400 and expected error code if email is already on use', async () => {
    const persistedUser = UserBuilder.aBasicCredentialsUser().build();
    await repository.create(persistedUser);

    const password = generateValidPassword();
    const nickname = UserNickname.of(generateValidNickname());

    const response = await request(app)
      .post(route)
      .send({
        credentials: {
          email: persistedUser.email.value,
          password: password,
        },
        nickname: nickname.value,
      })
      .expect('Content-Type', /json/)
      .expect(400);

    const { body } = response;

    expect(body.errorCode).toBe(ErrorCodes.EmailAlreadyInUse);
  });

  it('should return with 400 and expected error code if nickname is already on use', async () => {
    const nickname = UserNickname.of(generateValidNickname());

    const persistedUser = UserBuilder.aBasicCredentialsUser()
      .withNickname(nickname)
      .build();
    await repository.create(persistedUser);

    const password = generateValidPassword();

    const response = await request(app)
      .post(route)
      .send({
        credentials: {
          email: EmailMother.random().value,
          password: password,
        },
        nickname: nickname.value,
      })
      .expect('Content-Type', /json/)
      .expect(400);

    const { body } = response;

    expect(body.errorCode).toBe(ErrorCodes.NicknameAlreadyInUse);
  });

  it('should return with 400 if any params missing', async () => {
    await request(app)
      .post(route)
      .send({
        nickname: generateValidNickname(),
      })
      .expect('Content-Type', /json/)
      .expect(400);
  });
});
