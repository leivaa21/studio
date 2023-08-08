import { StartedTestContainer } from 'testcontainers';
import request from 'supertest';
import {
  connectMongooseToContainer,
  disconnectMongoTest,
  initializeMongoContainer,
} from '../../helpers/test-containers/mongo';
import { app } from '../../../src/api/app';
import { AuthorizationTokenBuilder } from '../../helpers/builders/AuthorizationTokenBuilder';
import { ErrorCodes } from '@studio/commons';
import {
  createCourseSubscription,
  findCourseSubscriptionsByUserId,
} from '../../helpers/persistance/mongo/course-subscriptions';
import { CourseSubscriptionBuilder } from '../../helpers/builders/CourseSubscriptionBuilder';

let mongoContainer: StartedTestContainer;
const route = '/course-subscription/:id';
const formatedRoute = (id: string) => `/course-subscription/${id}`;

beforeAll(async () => {
  mongoContainer = await initializeMongoContainer();
  await connectMongooseToContainer(mongoContainer);
}, 99999);

afterAll(async () => {
  await disconnectMongoTest();
  await mongoContainer.stop();
});

describe(`DELETE ${route}`, () => {
  it('should let delete an existant course subscription', async () => {
    const courseSubscription = new CourseSubscriptionBuilder().build();

    await createCourseSubscription(courseSubscription);

    await request(app)
      .delete(formatedRoute(courseSubscription.id.value))
      .set(
        'Authorization',
        new AuthorizationTokenBuilder()
          .withUserId(courseSubscription.userId.value)
          .build()
      )
      .expect('Content-Type', /json/)
      .expect(200);

    const userCourseSubscriptions = await findCourseSubscriptionsByUserId(
      courseSubscription.userId
    );

    expect(userCourseSubscriptions).toHaveLength(0);
  });

  it('should not let delete a course if request is not authorized', async () => {
    const courseSubscription = new CourseSubscriptionBuilder().build();

    await createCourseSubscription(courseSubscription);

    const response = await request(app)
      .delete(formatedRoute(courseSubscription.id.value))
      .expect('Content-Type', /json/)
      .expect(401);

    const userCourseSubscriptions = await findCourseSubscriptionsByUserId(
      courseSubscription.userId
    );

    expect(userCourseSubscriptions).toHaveLength(1);
    expect(response.body).toStrictEqual({
      message: `Authorization is required for request on DELETE ${formatedRoute(
        courseSubscription.id.value
      )}`,
      status: 401,
      kind: 'UNAUTHORIZED',
      errorCode: ErrorCodes.Unauthorized,
    });
  });
});