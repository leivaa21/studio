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
import { AuthorStatsBuilder } from '../../helpers/builders/AuthorStatsBuilder';
import { CourseBuilder } from '../../helpers/builders/CourseBuilder';
import { createAuthorStats } from '../../helpers/persistance/mongo/author-stats';
import { createCourse } from '../../helpers/persistance/mongo/courses';
import { AuthorStatNumber } from '../../../src/contexts/author-stats/domain/AuthorStatNumber';
import { ConsumerStatsBuilder } from '../../helpers/builders/ConsumerStatsBuilder';
import { createConsumerStats } from '../../helpers/persistance/mongo/consumer-stats';
import { ConsumerStatNumber } from '../../../src/contexts/consumer-stats/domain/ConsumerStatNumber';
import { CourseStatsBuilder } from '../../helpers/builders/CourseStatsBuilder';
import { createCourseStats } from '../../helpers/persistance/mongo/course-stats';
import { CourseStatNumber } from '../../../src/contexts/course-stats/domain/CourseStatNumber';

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
    const course = new CourseBuilder().build();
    const courseSubscription = new CourseSubscriptionBuilder()
      .withCourseId(course.id)
      .build();
    const authorStats = new AuthorStatsBuilder()
      .withAuthorId(course.authorId)
      .withSubscriptionsToOwnCourses(AuthorStatNumber.of(1))
      .build();

    const consumerStats = new ConsumerStatsBuilder()
      .withUserId(courseSubscription.userId)
      .withSubcribedCourses(ConsumerStatNumber.of(1))
      .build();

    const courseStats = new CourseStatsBuilder()
      .withCourseId(course.id)
      .withSubscriptions(CourseStatNumber.of(1))
      .build();

    await createCourse(course);
    await createCourseStats(courseStats);
    await createAuthorStats(authorStats);
    await createCourseSubscription(courseSubscription);
    await createConsumerStats(consumerStats);

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
