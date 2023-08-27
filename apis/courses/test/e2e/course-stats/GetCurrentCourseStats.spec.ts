import { StartedTestContainer } from 'testcontainers';
import request from 'supertest';
import {
  connectMongooseToContainer,
  disconnectMongoTest,
  initializeMongoContainer,
} from '../../helpers/test-containers/mongo';
import { app } from '../../../src/api/app';
import { createCourseStats } from '../../helpers/persistance/mongo/course-stats';
import { CourseStatsBuilder } from '../../helpers/builders/CourseStatsBuilder';

let mongoContainer: StartedTestContainer;
const route = '/course-stats/:id';
const formatRoute = (id: string) => `/course-stats/${id}`;

beforeAll(async () => {
  mongoContainer = await initializeMongoContainer();
  await connectMongooseToContainer(mongoContainer);
}, 99999);

afterAll(async () => {
  await disconnectMongoTest();
  await mongoContainer.stop();
});

describe(`GET ${route}`, () => {
  it('should get course stats', async () => {
    const courseStats = new CourseStatsBuilder().build();

    await createCourseStats(courseStats);

    const response = await request(app)
      .get(formatRoute(courseStats.courseId.value))
      .expect('Content-Type', /json/)
      .expect(200);

    expect(response.body).toStrictEqual(
      expect.objectContaining({
        courseId: courseStats.courseId.value,
      })
    );
  });
});
