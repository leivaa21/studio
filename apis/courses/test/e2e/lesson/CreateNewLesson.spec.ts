import { StartedTestContainer } from 'testcontainers';
import request from 'supertest';
import {
  connectMongooseToContainer,
  disconnectMongoTest,
  initializeMongoContainer,
} from '../../helpers/test-containers/mongo';
import { CourseBuilder } from '../../helpers/builders/CourseBuilder';
import { LessonBuilder } from '../../helpers/builders/LessonBuilder';
import { app } from '../../../src/api/app';
import { AuthorizationTokenBuilder } from '../../helpers/builders/AuthorizationTokenBuilder';
import { createCourse } from '../../helpers/persistance/mongo/courses';
import { ErrorCodes } from '@studio/commons';
import { findLessonsByCourseId } from '../../helpers/persistance/mongo/lessons';
import { AuthorStatsBuilder } from '../../helpers/builders/AuthorStatsBuilder';
import { createAuthorStats } from '../../helpers/persistance/mongo/author-stats';

let mongoContainer: StartedTestContainer;
const route = '/lessons';

beforeAll(async () => {
  mongoContainer = await initializeMongoContainer();
  await connectMongooseToContainer(mongoContainer);
}, 99999);

afterAll(async () => {
  await disconnectMongoTest();
  await mongoContainer.stop();
});

describe(`POST ${route}`, () => {
  it('should let create a new lesson', async () => {
    const course = new CourseBuilder().build();
    const authorStats = new AuthorStatsBuilder()
      .withAuthorId(course.authorId)
      .build();

    await createAuthorStats(authorStats);
    await createCourse(course);

    const { title, content } = new LessonBuilder().build();

    const body = {
      courseId: course.id.value,
      title: title.value,
      content: content.value,
    };

    await request(app)
      .post(route)
      .set(
        'Authorization',
        new AuthorizationTokenBuilder()
          .withUserId(course.authorId.value)
          .build()
      )
      .send(body)
      .expect('Content-Type', /json/)
      .expect(201);

    const courseLessons = await findLessonsByCourseId(course.id);

    expect(courseLessons).toBeDefined();
    expect(courseLessons).toHaveLength(1);
  });

  it.each([
    { missingParam: 'title' },
    { missingParam: 'content' },
    { missingParam: 'courseId' },
  ])(
    'should throw BadRequest Error if $missingParam is missing on body',
    async ({ missingParam }) => {
      const course = new CourseBuilder().build();
      const { title, content } = new LessonBuilder().build();

      await createCourse(course);

      const body = {
        courseId: missingParam === 'courseId' ? undefined : course.id.value,
        title: missingParam === 'title' ? undefined : title.value,
        content: missingParam === 'content' ? undefined : content.value,
      };

      const response = await request(app)
        .post(route)
        .set(
          'Authorization',
          new AuthorizationTokenBuilder()
            .withUserId(course.authorId.value)
            .build()
        )
        .send(body)
        .expect('Content-Type', /json/)
        .expect(400);

      const courseLessons = await findLessonsByCourseId(course.id);

      expect(courseLessons).toHaveLength(0);

      expect(response.body).toStrictEqual({
        message:
          'Title, content and courseId are required parameters when creating a new lesson',
        status: 400,
        kind: 'BAD_REQUEST',
        errorCode: ErrorCodes.BadRequest,
      });
    }
  );

  it('should not let create a new course if request is not authorized', async () => {
    const course = new CourseBuilder().build();
    const { title, content } = new LessonBuilder().build();

    await createCourse(course);

    const body = {
      courseId: course.id.value,
      title: title.value,
      content: content.value,
    };

    const response = await request(app)
      .post(route)
      .send(body)
      .expect('Content-Type', /json/)
      .expect(401);

    const courseLessons = await findLessonsByCourseId(course.id);

    expect(courseLessons).toHaveLength(0);

    expect(response.body).toStrictEqual({
      message: 'Authorization is required for request on POST /lessons',
      status: 401,
      kind: 'UNAUTHORIZED',
      errorCode: ErrorCodes.Unauthorized,
    });
  });
});
