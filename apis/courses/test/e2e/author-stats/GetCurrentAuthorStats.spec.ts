import { StartedTestContainer } from 'testcontainers';
import request from 'supertest';
import {
  connectMongooseToContainer,
  disconnectMongoTest,
  initializeMongoContainer,
} from '../../helpers/test-containers/mongo';
import { app } from '../../../src/api/app';
import { ErrorCodes } from '@studio/commons';
import { AuthorStatsBuilder } from '../../helpers/builders/AuthorStatsBuilder';
import { createAuthorStats } from '../../helpers/persistance/mongo/author-stats';
import { AuthorizationTokenBuilder } from '../../helpers/builders/AuthorizationTokenBuilder';

let mongoContainer: StartedTestContainer;
const route = '/author-stats';

beforeAll(async () => {
  mongoContainer = await initializeMongoContainer();
  await connectMongooseToContainer(mongoContainer);
}, 99999);

afterAll(async () => {
  await disconnectMongoTest();
  await mongoContainer.stop();
});

describe(`GET ${route}`, () => {
  it('should get author stats', async () => {
    const authorStats = new AuthorStatsBuilder().build();

    await createAuthorStats(authorStats);

    const response = await request(app)
      .get(route)
      .set(
        'Authorization',
        new AuthorizationTokenBuilder()
          .withUserId(authorStats.authorId.value)
          .build()
      )
      .expect('Content-Type', /json/)
      .expect(200);

    expect(response.body).toStrictEqual(
      expect.objectContaining({
        authorId: authorStats.authorId.value,
      })
    );
  });

  it('should response with 404 if theres no authorstats matching that authorid', async () => {
    const authorStats = new AuthorStatsBuilder().build();

    const response = await request(app)
      .get(route)
      .set(
        'Authorization',
        new AuthorizationTokenBuilder()
          .withUserId(authorStats.authorId.value)
          .build()
      )
      .expect('Content-Type', /json/)
      .expect(404);

    expect(response.body).toStrictEqual({
      message: `Author Stats for author id = <${authorStats.authorId.value}> couldn't be found`,
      status: 404,
      kind: 'NOT_FOUND',
      errorCode: ErrorCodes.AuthorStatsNotFound,
    });
  });

  it('should not let get author stats if request is not authorized', async () => {
    const authorStats = new AuthorStatsBuilder().build();

    await createAuthorStats(authorStats);

    const response = await request(app)
      .get(route)
      .expect('Content-Type', /json/)
      .expect(401);

    expect(response.body).toStrictEqual({
      message: `Authorization is required for request on GET ${route}`,
      status: 401,
      kind: 'UNAUTHORIZED',
      errorCode: ErrorCodes.Unauthorized,
    });
  });
});
