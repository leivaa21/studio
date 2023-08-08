import { StartedTestContainer } from 'testcontainers';
import request from 'supertest';
import {
  connectMongooseToContainer,
  disconnectMongoTest,
  initializeMongoContainer,
} from '../../helpers/test-containers/mongo';
import { CourseBuilder } from '../../helpers/builders/CourseBuilder';
import { app } from '../../../src/api/app';
import { AuthorizationTokenBuilder } from '../../helpers/builders/AuthorizationTokenBuilder';
import { createCourse } from '../../helpers/persistance/mongo/courses';
import { ErrorCodes } from '@studio/commons';
import { UserId } from '../../../src/contexts/course-subscriptions/domain/UserId';
import { createCourseSubscription } from '../../helpers/persistance/mongo/course-subscriptions';
import { CourseSubscriptionBuilder } from '../../helpers/builders/CourseSubscriptionBuilder';

let mongoContainer: StartedTestContainer;
const route = '/course-subscription/:courseId/check';
const formatedRoute = (courseId: string) =>
  `/course-subscription/${courseId}/check`;

beforeAll(async () => {
  mongoContainer = await initializeMongoContainer();
  await connectMongooseToContainer(mongoContainer);
}, 99999);

afterAll(async () => {
  await disconnectMongoTest();
  await mongoContainer.stop();
});

describe(`GET ${route}`, () => {
  it('should let check if user is subscribed to a course', async () => {
    const course = new CourseBuilder().withPublishedAt(new Date()).build();
    const userId = UserId.random();
    const courseSubscription = new CourseSubscriptionBuilder()
      .withCourseId(course.id)
      .withUserId(userId)
      .build();

    await createCourse(course);
    await createCourseSubscription(courseSubscription);

    const response = await request(app)
      .get(formatedRoute(course.id.value))
      .set(
        'Authorization',
        new AuthorizationTokenBuilder().withUserId(userId.value).build()
      )
      .expect('Content-Type', /json/)
      .expect(200);

    expect(response.body).toStrictEqual({ isSubscribed: true });
  });

  it('should not let create a new course if request is not authorized', async () => {
    const course = new CourseBuilder().withPublishedAt(new Date()).build();
    const userId = UserId.random();
    const courseSubscription = new CourseSubscriptionBuilder()
      .withCourseId(course.id)
      .withUserId(userId)
      .build();

    await createCourse(course);
    await createCourseSubscription(courseSubscription);

    const response = await request(app)
      .get(formatedRoute(course.id.value))
      .expect('Content-Type', /json/)
      .expect(401);

    expect(response.body).toStrictEqual({
      message: `Authorization is required for request on GET ${formatedRoute(
        course.id.value
      )}`,
      status: 401,
      kind: 'UNAUTHORIZED',
      errorCode: ErrorCodes.Unauthorized,
    });
  });
});
