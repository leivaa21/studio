import { StartedTestContainer } from 'testcontainers';

import {
  connectMongooseToContainer,
  disconnectMongoTest,
  initializeMongoContainer,
} from '../../helpers/test-containers/mongo';
import { CourseRepository } from '../../../src/contexts/courses/domain/CourseRepository';
import { MongoCourseRepository } from '../../../src/contexts/courses/infrastructure/persistance/mongo/MongoCourseRepository';
import { CourseSchemaFactory } from '../../../src/contexts/courses/infrastructure/persistance/mongo/CourseSchemaFactory';
import {
  createCourse,
  findCourseById,
} from '../../helpers/persistance/mongo/courses';
import { CourseBuilder } from '../../helpers/builders/CourseBuilder';
import { MongoCriteriaConverter } from '../../../src/contexts/shared/infrastructure/mongo/MongoCriteriaConverter';
import { AuthorId } from '../../../src/contexts/courses/domain/AuthorId';
import { CourseCriteria } from '../../../src/contexts/courses/domain/criteria/CourseCriteria';
import { CourseId } from '../../../src/contexts/courses/domain/CourseId';
import { CourseTags } from '../../../src/contexts/courses/domain/CourseTags';
import { CourseTag } from '../../../src/contexts/courses/domain/CourseTag';
import { CourseTag as CourseTagEnum } from '@studio/commons';

describe('Mongo Course Repository', () => {
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

      const courseFound = await findCourseById(course.id);

      expect(courseFound?.toPrimitives()).toStrictEqual(course.toPrimitives());
    });
  });

  describe('Finding Courses', () => {
    describe('By id', () => {
      it('Should find a course by his id', async () => {
        const course = new CourseBuilder().build();
        await createCourse(course);

        const foundCourse = await repository.findById(course.id);

        expect(foundCourse?.toPrimitives()).toStrictEqual(
          course.toPrimitives()
        );
      });

      it('Should not find a course if id is not equal', async () => {
        const course = new CourseBuilder().build();
        await createCourse(course);

        const foundCourse = await repository.findById(CourseId.random());

        expect(foundCourse).toBeNull();
      });
    });

    describe('By a matching criteria', () => {
      it('with fromAuthorWithFilters criteria', async () => {
        const authorId = AuthorId.random();

        const timestamp = new Date().getTime();

        const authoredCourse1 = new CourseBuilder()
          .withAuthorId(authorId)
          .withUpdatedAt(new Date(timestamp - 1000))
          .withTags(
            CourseTags.of([
              CourseTag.of(CourseTagEnum.Backend),
              CourseTag.of(CourseTagEnum.Frontend),
            ])
          )
          .build();
        const authoredCourse2 = new CourseBuilder()
          .withAuthorId(authorId)
          .withUpdatedAt(new Date(timestamp - 900))
          .withTags(CourseTags.of([CourseTag.of(CourseTagEnum.Frontend)]))
          .build();
        const authoredCourse3 = new CourseBuilder()
          .withAuthorId(authorId)
          .withUpdatedAt(new Date(timestamp - 800))
          .withTags(
            CourseTags.of([
              CourseTag.of(CourseTagEnum.Habits),
              CourseTag.of(CourseTagEnum.Paradigm),
            ])
          )
          .build();
        const authoredCourse4 = new CourseBuilder()
          .withAuthorId(authorId)
          .withUpdatedAt(new Date(timestamp - 700))
          .withTags(
            CourseTags.of([
              CourseTag.of(CourseTagEnum.Backend),
              CourseTag.of(CourseTagEnum.Personal),
            ])
          )
          .build();
        const nonAuthoredCourse1 = new CourseBuilder()
          .withUpdatedAt(new Date(timestamp - 600))
          .build();
        const nonAuthoredCourse2 = new CourseBuilder()
          .withUpdatedAt(new Date(timestamp - 500))
          .build();

        await Promise.all(
          [
            authoredCourse1,
            authoredCourse2,
            authoredCourse3,
            authoredCourse4,
            nonAuthoredCourse1,
            nonAuthoredCourse2,
          ].map((course) => createCourse(course))
        );

        const criteria = CourseCriteria.fromAuthorWithFilters({
          authorId,
          filters: { havingTags: ['Backend', 'Frontend'] },
        });

        const foundCourses = await repository.matching(criteria);

        expect(foundCourses).toHaveLength(3);
        expect(
          foundCourses.map((course) => course.toPrimitives())
        ).toStrictEqual(
          [authoredCourse4, authoredCourse2, authoredCourse1].map((course) =>
            course.toPrimitives()
          )
        );
      });
      it('with publishedCoursesFiltered criteria', async () => {
        const timestamp = new Date().getTime();

        const publishedCourse1 = new CourseBuilder()
          .withPublishedAt(new Date(timestamp - 1000))
          .withTags(
            CourseTags.of([
              CourseTag.of(CourseTagEnum.Backend),
              CourseTag.of(CourseTagEnum.Frontend),
            ])
          )
          .build();
        const publishedCourse2 = new CourseBuilder()
          .withPublishedAt(new Date(timestamp - 900))
          .withTags(CourseTags.of([CourseTag.of(CourseTagEnum.Frontend)]))
          .build();
        const publishedCourse3 = new CourseBuilder()
          .withPublishedAt(new Date(timestamp - 800))
          .withTags(
            CourseTags.of([
              CourseTag.of(CourseTagEnum.Habits),
              CourseTag.of(CourseTagEnum.Paradigm),
            ])
          )
          .build();
        const publishedCourse4 = new CourseBuilder()
          .withPublishedAt(new Date(timestamp - 700))
          .withTags(
            CourseTags.of([
              CourseTag.of(CourseTagEnum.Backend),
              CourseTag.of(CourseTagEnum.Personal),
            ])
          )
          .build();
        const nonPublishedCourse1 = new CourseBuilder().build();
        const nonPublishedCourse2 = new CourseBuilder().build();

        await Promise.all(
          [
            publishedCourse1,
            publishedCourse2,
            publishedCourse3,
            publishedCourse4,
            nonPublishedCourse1,
            nonPublishedCourse2,
          ].map((course) => createCourse(course))
        );

        const criteria = CourseCriteria.publishedCoursesFiltered({
          filters: { havingTags: ['Backend', 'Frontend'] },
        });

        const foundCourses = await repository.matching(criteria);

        expect(foundCourses).toHaveLength(3);
        expect(
          foundCourses.map((course) => course.toPrimitives())
        ).toStrictEqual(
          [publishedCourse4, publishedCourse2, publishedCourse1].map((course) =>
            course.toPrimitives()
          )
        );
      });
    });
    it('with paginatedPublishedWithFilters criteria', async () => {
      const subscribedCourses = [
        new CourseBuilder().withPublishedAt(new Date()).build(),
        new CourseBuilder().withPublishedAt(new Date()).build(),
        new CourseBuilder().withPublishedAt(new Date()).build(),
        new CourseBuilder().withPublishedAt(new Date()).build(),
      ];
      const nonSubscribedCourses = [
        new CourseBuilder().build(),
        new CourseBuilder().build(),
        new CourseBuilder().build(),
      ];

      await Promise.all(
        [...subscribedCourses, ...nonSubscribedCourses].map((course) =>
          createCourse(course)
        )
      );

      const criteria = CourseCriteria.subscribedCoursesFiltered({
        courseIds: subscribedCourses.map((course) => course.id),
        filters: {},
      });

      const foundCourses = await repository.matching(criteria);

      expect(foundCourses).toHaveLength(subscribedCourses.length);
    });
  });
});
