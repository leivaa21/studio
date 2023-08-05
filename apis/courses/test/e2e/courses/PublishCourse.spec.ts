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
import {
  createCourse,
  findCourseById,
} from '../../helpers/persistance/mongo/courses';
import { ErrorCodes } from '@studio/commons';
import { AuthorId } from '../../../src/contexts/courses/domain/AuthorId';

let mongoContainer: StartedTestContainer;
const route = '/course/:id/publish';
const formatedRoute = (id: string) => `/course/${id}/publish`;

beforeAll(async () => {
  mongoContainer = await initializeMongoContainer();
  await connectMongooseToContainer(mongoContainer);
}, 99999);

afterAll(async () => {
  await disconnectMongoTest();
  await mongoContainer.stop();
});

describe(`PUT ${route}`, () => {
  it('should publish an existant course', async () => {
    const course = new CourseBuilder().build();
    await createCourse(course);

    await request(app)
      .put(formatedRoute(course.id.value))
      .set(
        'Authorization',
        new AuthorizationTokenBuilder()
          .withUserId(course.authorId.value)
          .build()
      )
      .expect('Content-Type', /json/)
      .expect(200);

    const courseUpdated = await findCourseById(course.id);

    expect(courseUpdated?.publishedAt).not.toBeNull();
  });

  it('should not publish a non existant course', async () => {
    const course = new CourseBuilder().build();

    const response = await request(app)
      .put(formatedRoute(course.id.value))
      .set(
        'Authorization',
        new AuthorizationTokenBuilder()
          .withUserId(course.authorId.value)
          .build()
      )
      .expect('Content-Type', /json/)
      .expect(404);

    expect(response.body).toStrictEqual({
      message: `Course with id = <${course.id.value}> couldn't be found`,
      status: 404,
      kind: 'NOT_FOUND',
      errorCode: ErrorCodes.CourseNotFound,
    });
  });

  it('should not publish an existant course if not authored', async () => {
    const course = new CourseBuilder().build();

    await createCourse(course);

    const response = await request(app)
      .put(formatedRoute(course.id.value))
      .set(
        'Authorization',
        new AuthorizationTokenBuilder()
          .withUserId(AuthorId.random().value)
          .build()
      )
      .expect('Content-Type', /json/)
      .expect(404);

    expect(response.body).toStrictEqual({
      message: `Course with id = <${course.id.value}> couldn't be found`,
      status: 404,
      kind: 'NOT_FOUND',
      errorCode: ErrorCodes.CourseNotFound,
    });
  });

  it('should not publish a course if if request is not authorized', async () => {
    const course = new CourseBuilder().build();

    const response = await request(app)
      .put(formatedRoute(course.id.value))
      .expect('Content-Type', /json/)
      .expect(401);

    expect(response.body).toStrictEqual({
      message: `Authorization is required for request on PUT /course/${course.id.value}/publish`,
      status: 401,
      kind: 'UNAUTHORIZED',
      errorCode: ErrorCodes.Unauthorized,
    });
  });
});
