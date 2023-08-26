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
import { findCourseSubscriptionsByUserId } from '../../helpers/persistance/mongo/course-subscriptions';
import { AuthorStatsBuilder } from '../../helpers/builders/AuthorStatsBuilder';
import { CourseStatsBuilder } from '../../helpers/builders/CourseStatsBuilder';
import { createAuthorStats } from '../../helpers/persistance/mongo/author-stats';
import { createCourseStats } from '../../helpers/persistance/mongo/course-stats';

let mongoContainer: StartedTestContainer;
const route = '/course-subscriptions';

beforeAll(async () => {
  mongoContainer = await initializeMongoContainer();
  await connectMongooseToContainer(mongoContainer);
}, 99999);

afterAll(async () => {
  await disconnectMongoTest();
  await mongoContainer.stop();
});

describe(`POST ${route}`, () => {
  it('should let create a course subscription', async () => {
    const course = new CourseBuilder().withPublishedAt(new Date()).build();
    const userId = UserId.random();
    const authorStats = new AuthorStatsBuilder()
      .withAuthorId(course.authorId)
      .build();
    const courseStats = new CourseStatsBuilder()
      .withCourseId(course.id)
      .build();

    await createAuthorStats(authorStats);
    await createCourseStats(courseStats);
    await createCourse(course);

    const body = {
      courseId: course.id.value,
    };

    await request(app)
      .post(route)
      .set(
        'Authorization',
        new AuthorizationTokenBuilder().withUserId(userId.value).build()
      )
      .send(body)
      .expect('Content-Type', /json/)
      .expect(201);

    const userCourseSubscriptions = await findCourseSubscriptionsByUserId(
      userId
    );

    expect(userCourseSubscriptions).toBeDefined();
    expect(userCourseSubscriptions).toHaveLength(1);
  });

  it('should throw BadRequest Error if courseId is missing on body', async () => {
    const userId = UserId.random();

    const response = await request(app)
      .post(route)
      .set(
        'Authorization',
        new AuthorizationTokenBuilder().withUserId(userId.value).build()
      )
      .expect('Content-Type', /json/)
      .expect(400);

    const userCourseSubscriptions = await findCourseSubscriptionsByUserId(
      userId
    );
    expect(userCourseSubscriptions).toHaveLength(0);

    expect(response.body).toStrictEqual({
      message: 'courseId is required when subscribing to a course',
      status: 400,
      kind: 'BAD_REQUEST',
      errorCode: ErrorCodes.BadRequest,
    });
  });
  it('should not let create a new course if request is not authorized', async () => {
    const course = new CourseBuilder().build();
    const userId = UserId.random();

    await createCourse(course);

    const body = {
      courseId: course.id.value,
    };

    const response = await request(app)
      .post(route)
      .send(body)
      .expect('Content-Type', /json/)
      .expect(401);

    const userCourseSubscriptions = await findCourseSubscriptionsByUserId(
      userId
    );

    expect(userCourseSubscriptions).toHaveLength(0);

    expect(response.body).toStrictEqual({
      message:
        'Authorization is required for request on POST /course-subscriptions',
      status: 401,
      kind: 'UNAUTHORIZED',
      errorCode: ErrorCodes.Unauthorized,
    });
  });
});
