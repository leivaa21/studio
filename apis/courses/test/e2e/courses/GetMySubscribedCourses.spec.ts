import { StartedTestContainer } from 'testcontainers';
import request from 'supertest';
import {
  connectMongooseToContainer,
  disconnectMongoTest,
  initializeMongoContainer,
} from '../../helpers/test-containers/mongo';
import { CourseBuilder } from '../../helpers/builders/CourseBuilder';
import { app } from '../../../src/api/app';
import { createCourse } from '../../helpers/persistance/mongo/courses';
import { ErrorCodes } from '@studio/commons';
import { AuthorizationTokenBuilder } from '../../helpers/builders/AuthorizationTokenBuilder';
import { UserId } from '../../../src/contexts/course-subscriptions/domain/UserId';
import { CourseSubscriptionBuilder } from '../../helpers/builders/CourseSubscriptionBuilder';
import { createCourseSubscription } from '../../helpers/persistance/mongo/course-subscriptions';

let mongoContainer: StartedTestContainer;
const route = '/courses/subscribed';

beforeAll(async () => {
  mongoContainer = await initializeMongoContainer();
  await connectMongooseToContainer(mongoContainer);
}, 99999);

afterAll(async () => {
  await disconnectMongoTest();
  await mongoContainer.stop();
});

describe(`GET ${route}`, () => {
  it('should get the paginated courses', async () => {
    const userId = UserId.random();
    const course = new CourseBuilder().build();
    const courseSubscription = new CourseSubscriptionBuilder()
      .withCourseId(course.id)
      .withUserId(userId)
      .build();

    await createCourse(course);
    await createCourseSubscription(courseSubscription);

    const response = await request(app)
      .get(route)
      .set(
        'Authorization',
        new AuthorizationTokenBuilder().withUserId(userId.value).build()
      )
      .expect('Content-Type', /json/)
      .expect(200);

    expect(response.body).toStrictEqual([
      expect.objectContaining({
        title: course.title.value,
        id: course.id.value,
      }),
    ]);
  });

  it('should not let get any courses if request is not authorized', async () => {
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
