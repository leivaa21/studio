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
import { create, findById } from '../../helpers/persistance/mongo/courses';
import { ErrorCodes } from '@studio/commons';
import { AuthorId } from '../../../src/contexts/courses/domain/AuthorId';

let mongoContainer: StartedTestContainer;
const route = '/course/:id/title';
const formatedRoute = (id: string) => `/course/${id}/title`;

beforeAll(async () => {
  mongoContainer = await initializeMongoContainer();
  await connectMongooseToContainer(mongoContainer);
}, 99999);

afterAll(async () => {
  await disconnectMongoTest();
  await mongoContainer.stop();
});

describe(`PUT ${route}`, () => {
  it('should rename an existant course', async () => {
    const course = new CourseBuilder().build();
    await create(course);

    const body = {
      title: new CourseBuilder().build().title.value,
    };

    await request(app)
      .put(formatedRoute(course.id.value))
      .set(
        'Authorization',
        new AuthorizationTokenBuilder()
          .withUserId(course.authorId.value)
          .build()
      )
      .send(body)
      .expect('Content-Type', /json/)
      .expect(200);

    const courseUpdated = await findById(course.id);

    expect(courseUpdated?.title.value).toStrictEqual(body.title);
  });

  it('should require a title to rename an existant course', async () => {
    const course = new CourseBuilder().build();
    await create(course);

    const body = {};

    const response = await request(app)
      .put(formatedRoute(course.id.value))
      .set(
        'Authorization',
        new AuthorizationTokenBuilder()
          .withUserId(course.authorId.value)
          .build()
      )
      .send(body)
      .expect('Content-Type', /json/)
      .expect(400);

    expect(response.body).toStrictEqual({
      message: `Param title is required to rename a course!`,
      status: 400,
      kind: 'BAD_REQUEST',
      errorCode: ErrorCodes.BadRequest,
    });
  });

  it('should not rename a non existant course', async () => {
    const course = new CourseBuilder().build();

    const body = {
      title: new CourseBuilder().build().title.value,
    };

    const response = await request(app)
      .put(formatedRoute(course.id.value))
      .set(
        'Authorization',
        new AuthorizationTokenBuilder()
          .withUserId(course.authorId.value)
          .build()
      )
      .send(body)
      .expect('Content-Type', /json/)
      .expect(404);

    expect(response.body).toStrictEqual({
      message: `Course with id = <${course.id.value}> couldn't be found`,
      status: 404,
      kind: 'NOT_FOUND',
      errorCode: ErrorCodes.CourseNotFound,
    });
  });

  it('should not rename an existant course if not authored', async () => {
    const course = new CourseBuilder().build();

    await create(course);

    const body = {
      title: new CourseBuilder().build().title.value,
    };

    const response = await request(app)
      .put(formatedRoute(course.id.value))
      .set(
        'Authorization',
        new AuthorizationTokenBuilder()
          .withUserId(AuthorId.random().value)
          .build()
      )
      .send(body)
      .expect('Content-Type', /json/)
      .expect(404);

    expect(response.body).toStrictEqual({
      message: `Course with id = <${course.id.value}> couldn't be found`,
      status: 404,
      kind: 'NOT_FOUND',
      errorCode: ErrorCodes.CourseNotFound,
    });
  });

  it('should not rename a course if request is not authorized', async () => {
    const course = new CourseBuilder().build();

    const body = {
      title: new CourseBuilder().build().title.value,
    };

    const response = await request(app)
      .put(formatedRoute(course.id.value))
      .send(body)
      .expect('Content-Type', /json/)
      .expect(401);

    expect(response.body).toStrictEqual({
      message: `Authorization is required for request on PUT /course/${course.id.value}/title`,
      status: 401,
      kind: 'UNAUTHORIZED',
      errorCode: ErrorCodes.Unauthorized,
    });
  });
});
