import { StartedTestContainer } from 'testcontainers';

import {
  connectMongooseToContainer,
  disconnectMongoTest,
  initializeMongoContainer,
} from '../../helpers/test-containers/mongo';
import { CourseRepository } from '../../../src/contexts/courses/domain/CourseRepository';
import { MongoCourseRepository } from '../../../src/contexts/courses/infrastructure/persistance/mongo/MongoCourseRepository';
import { CourseSchemaFactory } from '../../../src/contexts/courses/infrastructure/persistance/mongo/CourseSchemaFactory';
import { create, findById } from '../../helpers/persistance/mongo/courses';
import { CourseBuilder } from '../../helpers/builders/CourseBuilder';
import { MongoCriteriaConverter } from '../../../src/contexts/shared/infrastructure/mongo/MongoCriteriaConverter';
import { AuthorId } from '../../../src/contexts/courses/domain/AuthorId';
import { CourseCriteria } from '../../../src/contexts/courses/domain/criteria/CourseCriteria';
import { NumberMother } from '../../helpers/object-mother/NumberMother';

describe('Mongo User Repository', () => {
  jest.setTimeout(9999999);

  let repository: CourseRepository;
  let container: StartedTestContainer;

  beforeAll(async () => {
    repository = new MongoCourseRepository(
      new CourseSchemaFactory(),
      new MongoCriteriaConverter()
    );
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

  describe('Finding Courses', () => {
    it('Should match courses with paginatedFromAuthorWithFilters criteria', async () => {
      // TO DO: Refactor this test into a more corret one
      const authorId = AuthorId.random();

      const authoredCourse1 = new CourseBuilder()
        .withAuthorId(authorId)
        .build();
      const authoredCourse2 = new CourseBuilder()
        .withAuthorId(authorId)
        .build();
      await create(authoredCourse1);
      await create(authoredCourse2);

      const criteria = CourseCriteria.paginatedFromAuthorWithFilters({
        authorId,
        page: 0,
        pageSize: 2,
        filters: {},
      });

      const foundCourses = await repository.matching(criteria);

      expect(foundCourses).toHaveLength(2);
    });
  });
});
