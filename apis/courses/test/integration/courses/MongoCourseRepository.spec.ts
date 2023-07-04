import { StartedTestContainer } from 'testcontainers';

import {
  connectMongooseToContainer,
  disconnectMongoTest,
  initializeMongoContainer,
} from '../../helpers/test-containers/mongo';
import { CourseRepository } from '../../../src/contexts/courses/domain/CourseRepository';
import { MongoCourseRepository } from '../../../src/contexts/courses/infrastructure/persistance/mongo/MongoCourseRepository';
import { CourseSchemaFactory } from '../../../src/contexts/courses/infrastructure/persistance/mongo/CourseSchemaFactory';
import { findById } from '../../helpers/persistance/mongo/courses';
import { CourseBuilder } from '../../helpers/builders/CourseBuilder';

describe('Mongo User Repository', () => {
  jest.setTimeout(9999999);

  let repository: CourseRepository;
  let container: StartedTestContainer;

  beforeAll(async () => {
    repository = new MongoCourseRepository(new CourseSchemaFactory());
    container = await initializeMongoContainer();
    await connectMongooseToContainer(container);
  });

  afterAll(async () => {
    await disconnectMongoTest();
    await container.stop();
  });

  describe('Persisting Course', () => {
    it('should let persist a course', async () => {
      const course = new CourseBuilder().build();
      await repository.create(course);

      const courseFound = await findById(course.id);

      expect(courseFound?.toPrimitives()).toStrictEqual(course.toPrimitives());
    });
  });
});
