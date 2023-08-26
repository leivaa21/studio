import { StartedTestContainer } from 'testcontainers';

import {
  connectMongooseToContainer,
  disconnectMongoTest,
  initializeMongoContainer,
} from '../../helpers/test-containers/mongo';
import { CourseStatsRepository } from '../../../src/contexts/course-stats/domain/CourseStatsRepository';
import { MongoCourseStatsRepository } from '../../../src/contexts/course-stats/infrastructure/persistance/mongo/MongoCourseStatsRepository';
import { CourseStatsSchemaFactory } from '../../../src/contexts/course-stats/infrastructure/persistance/mongo/CourseStatsSchemaFactory';
import { CourseStatsBuilder } from '../../helpers/builders/CourseStatsBuilder';
import {
  createCourseStats,
  findCourseStats,
} from '../../helpers/persistance/mongo/course-stats';

describe('Mongo Course Stats Repository', () => {
  jest.setTimeout(9999999);

  let repository: CourseStatsRepository;
  let container: StartedTestContainer;

  beforeAll(async () => {
    repository = new MongoCourseStatsRepository(new CourseStatsSchemaFactory());
    container = await initializeMongoContainer();
    await connectMongooseToContainer(container);
  });

  afterAll(async () => {
    await disconnectMongoTest();
    await container.stop();
  });

  describe('Persisting Course Stats', () => {
    it('should let persist an course stats', async () => {
      const courseStats = new CourseStatsBuilder().build();
      await repository.create(courseStats);

      const courseStatsFound = await findCourseStats(courseStats.courseId);

      expect(courseStatsFound?.toPrimitives()).toStrictEqual(
        courseStats.toPrimitives()
      );
    });
  });

  describe('Finding course Stats', () => {
    it('Should let find an course stats by course Id', async () => {
      const courseStats = new CourseStatsBuilder().build();
      await createCourseStats(courseStats);

      const courseStatsFound = await repository.find(courseStats.courseId);

      expect(courseStatsFound?.toPrimitives()).toStrictEqual(
        courseStats.toPrimitives()
      );
    });
  });

  describe('Updating course Stats', () => {
    it('Should let update an course stats', async () => {
      const courseStats = new CourseStatsBuilder().build();
      await createCourseStats(courseStats);

      courseStats.increaseSubscriptions();

      await repository.update(courseStats);

      const courseStatsFound = await findCourseStats(courseStats.courseId);

      expect(courseStatsFound?.toPrimitives()).toStrictEqual(
        courseStats.toPrimitives()
      );
      expect(courseStatsFound?.toPrimitives()).toStrictEqual(
        expect.objectContaining({
          subscriptions: 1,
        })
      );
    });
  });

  describe('Deleting Course Stats', () => {
    it('Should let delete an course stats by course Id', async () => {
      const courseStats = new CourseStatsBuilder().build();
      await createCourseStats(courseStats);

      await repository.delete(courseStats.courseId);

      const courseStatsFound = await findCourseStats(courseStats.courseId);

      expect(courseStatsFound).toBeUndefined();
    });
  });
});
