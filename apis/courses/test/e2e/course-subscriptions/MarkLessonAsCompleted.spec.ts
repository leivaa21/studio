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
  findCourseSubscriptionById,
} from '../../helpers/persistance/mongo/course-subscriptions';
import { createLesson } from '../../helpers/persistance/mongo/lessons';
import { CourseSubscriptionBuilder } from '../../helpers/builders/CourseSubscriptionBuilder';
import { LessonBuilder } from '../../helpers/builders/LessonBuilder';
import { ConsumerStatsBuilder } from '../../helpers/builders/ConsumerStatsBuilder';
import { createConsumerStats } from '../../helpers/persistance/mongo/consumer-stats';

let mongoContainer: StartedTestContainer;
const route = '/course-subscription/complete-lesson/:lessonId';
const formatedRoute = (lessonId: string) =>
  `/course-subscription/complete-lesson/${lessonId}`;

beforeAll(async () => {
  mongoContainer = await initializeMongoContainer();
  await connectMongooseToContainer(mongoContainer);
}, 99999);

afterAll(async () => {
  await disconnectMongoTest();
  await mongoContainer.stop();
});

describe(`PUT ${route}`, () => {
  it('should let mark as completed a lesson', async () => {
    const lesson = new LessonBuilder().build();
    const courseSubscription = new CourseSubscriptionBuilder()
      .withCourseId(lesson.courseId)
      .build();
    const consumerStats = new ConsumerStatsBuilder()
      .withUserId(courseSubscription.userId)
      .build();

    await createCourseSubscription(courseSubscription);
    await createLesson(lesson);
    await createConsumerStats(consumerStats);

    await request(app)
      .put(formatedRoute(lesson.id.value))
      .set(
        'Authorization',
        new AuthorizationTokenBuilder()
          .withUserId(courseSubscription.userId.value)
          .build()
      )
      .expect('Content-Type', /json/)
      .expect(200);

    const userCourseSubscription = await findCourseSubscriptionById(
      courseSubscription.id
    );

    expect(userCourseSubscription?.completedLessons).toHaveLength(1);
  });

  it('should not let mark lesson as completed if request is not authorized', async () => {
    const lesson = new LessonBuilder().build();
    const courseSubscription = new CourseSubscriptionBuilder()
      .withCourseId(lesson.courseId)
      .build();

    await createCourseSubscription(courseSubscription);
    await createLesson(lesson);

    const response = await request(app)
      .put(formatedRoute(lesson.id.value))
      .expect('Content-Type', /json/)
      .expect(401);

    const userCourseSubscription = await findCourseSubscriptionById(
      courseSubscription.id
    );

    expect(userCourseSubscription?.completedLessons).toHaveLength(0);

    expect(response.body).toStrictEqual({
      message: `Authorization is required for request on PUT ${formatedRoute(
        lesson.id.value
      )}`,
      status: 401,
      kind: 'UNAUTHORIZED',
      errorCode: ErrorCodes.Unauthorized,
    });
  });
});
