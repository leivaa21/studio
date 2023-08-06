import { StartedTestContainer } from 'testcontainers';

import {
  connectMongooseToContainer,
  disconnectMongoTest,
  initializeMongoContainer,
} from '../../helpers/test-containers/mongo';
import { LessonRepository } from '../../../src/contexts/lessons/domain/LessonRepository';
import { MongoLessonRepository } from '../../../src/contexts/lessons/infrastructure/persistance/mongo/MongoLessonRepository';
import { LessonSchemaFactory } from '../../../src/contexts/lessons/infrastructure/persistance/mongo/LessonSchemaFactory';
import { LessonBuilder } from '../../helpers/builders/LessonBuilder';
import {
  createLesson,
  findLessonById,
} from '../../helpers/persistance/mongo/lessons';
import { LessonId } from '../../../src/contexts/lessons/domain/LessonId';
import { CourseId } from '../../../src/contexts/courses/domain/CourseId';

describe('Mongo Lesson Repository', () => {
  jest.setTimeout(9999999);

  let repository: LessonRepository;
  let container: StartedTestContainer;

  beforeAll(async () => {
    repository = new MongoLessonRepository(new LessonSchemaFactory());
    container = await initializeMongoContainer();
    await connectMongooseToContainer(container);
  });

  afterAll(async () => {
    await disconnectMongoTest();
    await container.stop();
  });

  describe('Persisting Lesson', () => {
    it('should let persist a lesson', async () => {
      const lesson = new LessonBuilder().build();
      await repository.create(lesson);

      const lessonFound = await findLessonById(lesson.id);

      expect(lessonFound?.toPrimitives()).toStrictEqual(lesson.toPrimitives());
    });
  });

  describe('Finding Lessons', () => {
    describe('By id', () => {
      it('Should find a lesson by his id', async () => {
        const lesson = new LessonBuilder().build();
        await createLesson(lesson);

        const foundLesson = await repository.findById(lesson.id);

        expect(foundLesson?.toPrimitives()).toStrictEqual(
          lesson.toPrimitives()
        );
      });

      it('Should not find a lesson if id is not equal', async () => {
        const lesson = new LessonBuilder().build();
        await createLesson(lesson);

        const foundLesson = await repository.findById(LessonId.random());

        expect(foundLesson).toBeNull();
      });
    });

    describe('By course id', () => {
      it('Should find lessons by their course id', async () => {
        const courseId = CourseId.random();
        const lesson = new LessonBuilder().withCourseId(courseId).build();
        const lesson2 = new LessonBuilder().withCourseId(courseId).build();
        const lessonFromAnotherCourse = new LessonBuilder().build();

        await Promise.all(
          [lesson, lesson2, lessonFromAnotherCourse].map((lesson) =>
            createLesson(lesson)
          )
        );

        const foundLessons = await repository.findByCourseId(courseId);

        [lesson, lesson2].map((lesson) => {
          expect(
            foundLessons.find(
              (foundLesson) => foundLesson.id.value === lesson.id.value
            )
          ).toBeDefined();
        });
      });
    });
  });
  describe('Updating Lesson', () => {
    it('should let update a lesson', async () => {
      const lesson = new LessonBuilder().build();
      await createLesson(lesson);

      const { title, content } = new LessonBuilder().build();

      lesson.updateTitle(title);
      lesson.updateContent(content);

      await repository.update(lesson);

      const lessonFound = await findLessonById(lesson.id);

      expect(lessonFound?.toPrimitives()).toStrictEqual(
        expect.objectContaining({
          id: lesson.id.value,
          title: title.value,
          content: content.value,
        })
      );
    });
  });

  describe('Deleting a Lesson', () => {
    it('should let delete a lesson', async () => {
      const lesson = new LessonBuilder().build();
      await createLesson(lesson);

      await repository.deleteById(lesson.id);

      const lessonFound = await findLessonById(lesson.id);

      expect(lessonFound).toBeUndefined();
    });
  });
});
