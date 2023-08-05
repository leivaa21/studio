import { StartedTestContainer } from 'testcontainers';
import request from 'supertest';
import {
  connectMongooseToContainer,
  disconnectMongoTest,
  initializeMongoContainer,
} from '../../helpers/test-containers/mongo';
import { CourseBuilder } from '../../helpers/builders/CourseBuilder';
import { app } from '../../../src/api/app';
import { create } from '../../helpers/persistance/mongo/courses';
import { ErrorCodes } from '@studio/commons';

let mongoContainer: StartedTestContainer;
const route = '/course';

beforeAll(async () => {
  mongoContainer = await initializeMongoContainer();
  await connectMongooseToContainer(mongoContainer);
}, 99999);

afterAll(async () => {
  await disconnectMongoTest();
  await mongoContainer.stop();
});

describe(`GET ${route}/:id`, () => {
  it('should get the persisted course with id matching the path', async () => {
    const course = new CourseBuilder().build();
    await create(course);

    const response = await request(app)
      .get(`${route}/${course.id.value}`)
      .expect('Content-Type', /json/)
      .expect(200);

    expect(response.body).toStrictEqual(
      expect.objectContaining({
        title: course.title.value,
        id: course.id.value,
      })
    );
  });

  it('should response with 404 if theres no course matching that id', async () => {
    const course = new CourseBuilder().build();

    const response = await request(app)
      .get(`${route}/${course.id.value}`)
      .expect('Content-Type', /json/)
      .expect(404);

    expect(response.body).toStrictEqual({
      message: `Course with id = <${course.id.value}> couldn't be found`,
      status: 404,
      kind: 'NOT_FOUND',
      errorCode: ErrorCodes.CourseNotFound,
    });
  });
});
