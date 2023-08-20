import { StartedTestContainer } from 'testcontainers';
import request from 'supertest';
import {
  connectMongooseToContainer,
  disconnectMongoTest,
  initializeMongoContainer,
} from '../../helpers/test-containers/mongo';
import { CourseBuilder } from '../../helpers/builders/CourseBuilder';
import { app } from '../../../src/api/app';
import { createCourse } from '../../helpers/persistance/mongo/courses';

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

describe(`GET ${route}`, () => {
  it('should get the published courses', async () => {
    const course = new CourseBuilder().withPublishedAt(new Date()).build();
    await createCourse(course);

    const response = await request(app)
      .get(route)
      .expect('Content-Type', /json/)
      .expect(200);

    expect(response.body).toStrictEqual([
      expect.objectContaining({
        title: course.title.value,
        id: course.id.value,
      }),
    ]);
  });
});
