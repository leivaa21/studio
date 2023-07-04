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
});
