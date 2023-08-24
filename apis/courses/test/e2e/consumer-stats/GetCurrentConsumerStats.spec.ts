import { StartedTestContainer } from 'testcontainers';
import request from 'supertest';
import {
  connectMongooseToContainer,
  disconnectMongoTest,
  initializeMongoContainer,
} from '../../helpers/test-containers/mongo';
import { app } from '../../../src/api/app';
import { ErrorCodes } from '@studio/commons';
import { createConsumerStats } from '../../helpers/persistance/mongo/consumer-stats';
import { AuthorizationTokenBuilder } from '../../helpers/builders/AuthorizationTokenBuilder';
import { ConsumerStatsBuilder } from '../../helpers/builders/ConsumerStatsBuilder';

let mongoContainer: StartedTestContainer;
const route = '/consumer-stats';

beforeAll(async () => {
  mongoContainer = await initializeMongoContainer();
  await connectMongooseToContainer(mongoContainer);
}, 99999);

afterAll(async () => {
  await disconnectMongoTest();
  await mongoContainer.stop();
});

describe(`GET ${route}`, () => {
  it('should get consumer stats', async () => {
    const consumerStats = new ConsumerStatsBuilder().build();

    await createConsumerStats(consumerStats);

    const response = await request(app)
      .get(route)
      .set(
        'Authorization',
        new AuthorizationTokenBuilder()
          .withUserId(consumerStats.userId.value)
          .build()
      )
      .expect('Content-Type', /json/)
      .expect(200);

    expect(response.body).toStrictEqual(
      expect.objectContaining({
        userId: consumerStats.userId.value,
      })
    );
  });

  it('should response with 404 if theres no consumer stats matching that user id', async () => {
    const consumerStats = new ConsumerStatsBuilder().build();

    const response = await request(app)
      .get(route)
      .set(
        'Authorization',
        new AuthorizationTokenBuilder()
          .withUserId(consumerStats.userId.value)
          .build()
      )
      .expect('Content-Type', /json/)
      .expect(404);

    expect(response.body).toStrictEqual({
      message: `Consumer Stats for user id = <${consumerStats.userId.value}> couldn't be found`,
      status: 404,
      kind: 'NOT_FOUND',
      errorCode: ErrorCodes.ConsumerStatsNotFound,
    });
  });

  it('should not let get consumer stats if request is not authorized', async () => {
    const consumerStats = new ConsumerStatsBuilder().build();

    await createConsumerStats(consumerStats);

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
