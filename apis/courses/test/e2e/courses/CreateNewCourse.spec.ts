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
import { findByAuthorId } from '../../helpers/persistance/mongo/courses';
import { ErrorCodes } from '@studio/commons';

let mongoContainer: StartedTestContainer;
const route = '/courses';

beforeAll(async () => {
  mongoContainer = await initializeMongoContainer();
  await connectMongooseToContainer(mongoContainer);
}, 99999);

afterAll(async () => {
  await disconnectMongoTest();
  await mongoContainer.stop();
});

describe(`POST ${route}`, () => {
  it('should let create a new course', async () => {
    const course = new CourseBuilder().build();
    const body = {
      title: course.title.value,
      description: course.description.value,
      tags: course.tags.values,
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

    const authorCourses = await findByAuthorId(course.authorId);

    expect(authorCourses).toBeDefined();
    expect(authorCourses).toHaveLength(1);
  });

  it.each([
    { missingParam: 'title' },
    { missingParam: 'description' },
    { missingParam: 'tags' },
  ])(
    'should throw BadRequest Error if $missingParam is missing on body',
    async ({ missingParam }) => {
      const course = new CourseBuilder().build();
      const body = {
        title: missingParam === 'title' ? undefined : course.title.value,
        description:
          missingParam === 'description' ? undefined : course.description.value,
        tags: missingParam === 'tags' ? undefined : course.tags.values,
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

      const authorCourses = await findByAuthorId(course.authorId);

      expect(authorCourses).toHaveLength(0);

      expect(response.body).toStrictEqual({
        message:
          'Title, description and tags are required parameters when creating a new course',
        status: 400,
        kind: 'BAD_REQUEST',
        errorCode: ErrorCodes.BadRequest,
      });
    }
  );
  it('should not let create a new course if request is not authorized', async () => {
    const course = new CourseBuilder().build();
    const body = {
      title: course.title.value,
      description: course.description.value,
      tags: course.tags.values,
    };
    const response = await request(app)
      .post(route)
      .send(body)
      .expect('Content-Type', /json/)
      .expect(401);

    const authorCourses = await findByAuthorId(course.authorId);

    expect(authorCourses).toBeDefined();
    expect(authorCourses).toHaveLength(0);

    expect(response.body).toStrictEqual({
      message: 'Authorization is required for request on POST /courses',
      status: 401,
      kind: 'UNAUTHORIZED',
      errorCode: ErrorCodes.Unauthorized,
    });
  });
});
