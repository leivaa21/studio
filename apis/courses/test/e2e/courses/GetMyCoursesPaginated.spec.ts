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
import { AuthorizationTokenBuilder } from '../../helpers/builders/AuthorizationTokenBuilder';

let mongoContainer: StartedTestContainer;
const route = '/courses/authored';

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
    const course = new CourseBuilder().build();
    await create(course);

    const response = await request(app)
      .get(route)
      .set(
        'Authorization',
        new AuthorizationTokenBuilder()
          .withUserId(course.authorId.value)
          .build()
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
      message: 'Authorization is required for request on GET /courses/authored',
      status: 401,
      kind: 'UNAUTHORIZED',
      errorCode: ErrorCodes.Unauthorized,
    });
  });
});
