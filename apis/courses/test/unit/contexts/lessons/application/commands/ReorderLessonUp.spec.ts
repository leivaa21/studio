import { mock, mockReset } from 'jest-mock-extended';
import { CourseRepository } from '../../../../../../src/contexts/courses/domain/CourseRepository';
import { LessonRepository } from '../../../../../../src/contexts/lessons/domain/LessonRepository';
import {
  ReorderLessonUp,
  ReorderLessonUpCommand,
} from '../../../../../../src/contexts/lessons/application/commands/ReorderLessonUp';
import { EventBus } from '../../../../../../src/contexts/shared/domain/EventBus';
import { CourseBuilder } from '../../../../../helpers/builders/CourseBuilder';
import { LessonBuilder } from '../../../../../helpers/builders/LessonBuilder';
import { AuthorId } from '../../../../../../src/contexts/courses/domain/AuthorId';
import { CourseNotFoundError } from '../../../../../../src/contexts/courses/domain/errors/CourseNotFoundError';
import { LessonOrder } from '../../../../../../src/contexts/lessons/domain/LessonOrder';
import { UnableToReorderLessonError } from '../../../../../../src/contexts/lessons/domain/errors/UnableToReorderLessonError';
import { LessonNotFoundError } from '../../../../../../src/contexts/lessons/domain/errors/LessonNotFoundError';

describe('Reorder Lesson up', () => {
  const lessonRepository = mock<LessonRepository>();
  const courseRepository = mock<CourseRepository>();
  const eventBus = mock<EventBus>();

  beforeEach(() => {
    mockReset(lessonRepository);
    mockReset(courseRepository);
    mockReset(eventBus);
  });

  it('Should reorder an existant lesson up from an authored course', async () => {
    const course = new CourseBuilder().build();

    const lesson = new LessonBuilder()
      .withOrder(LessonOrder.of(1))
      .withCourseId(course.id)
      .build();
    const lesson0 = new LessonBuilder()
      .withOrder(LessonOrder.of(0))
      .withCourseId(course.id)
      .build();
    const lesson2 = new LessonBuilder()
      .withOrder(LessonOrder.of(2))
      .withCourseId(course.id)
      .build();

    const command = new ReorderLessonUpCommand({
      authorId: course.authorId.value,
      lessonId: lesson.id.value,
    });

    lessonRepository.findById.mockResolvedValue(lesson);
    courseRepository.findById.mockResolvedValue(course);
    lessonRepository.findByCourseId.mockResolvedValue([
      lesson0,
      lesson,
      lesson2,
    ]);

    const useCase = new ReorderLessonUp(
      lessonRepository,
      courseRepository,
      eventBus
    );

    await expect(useCase.execute(command)).resolves.not.toThrow();
    expect(lessonRepository.update).toBeCalledTimes(2);
    expect(lessonRepository.update).toBeCalledWith(
      expect.objectContaining({
        id: lesson0.id,
        order: LessonOrder.of(1),
      })
    );
    expect(lessonRepository.update).toBeCalledWith(
      expect.objectContaining({
        id: lesson.id,
        order: LessonOrder.of(0),
      })
    );
    expect(eventBus.publish).toBeCalled();
  });

  it('Should not reorder a lesson up if its already first', async () => {
    const course = new CourseBuilder().build();

    const lesson = new LessonBuilder()
      .withOrder(LessonOrder.of(0))
      .withCourseId(course.id)
      .build();
    const lesson1 = new LessonBuilder()
      .withOrder(LessonOrder.of(1))
      .withCourseId(course.id)
      .build();
    const lesson2 = new LessonBuilder()
      .withOrder(LessonOrder.of(2))
      .withCourseId(course.id)
      .build();

    const command = new ReorderLessonUpCommand({
      authorId: course.authorId.value,
      lessonId: lesson.id.value,
    });

    lessonRepository.findById.mockResolvedValue(lesson);
    courseRepository.findById.mockResolvedValue(course);
    lessonRepository.findByCourseId.mockResolvedValue([
      lesson,
      lesson1,
      lesson2,
    ]);

    const useCase = new ReorderLessonUp(
      lessonRepository,
      courseRepository,
      eventBus
    );

    await expect(useCase.execute(command)).rejects.toThrow(
      UnableToReorderLessonError
    );
    expect(lessonRepository.update).not.toBeCalled();
  });

  it('Should not reorder a lesson up if its the only lesson of a course', async () => {
    const course = new CourseBuilder().build();

    const lesson = new LessonBuilder().withCourseId(course.id).build();

    const command = new ReorderLessonUpCommand({
      authorId: course.authorId.value,
      lessonId: lesson.id.value,
    });

    lessonRepository.findById.mockResolvedValue(lesson);
    courseRepository.findById.mockResolvedValue(course);
    lessonRepository.findByCourseId.mockResolvedValue([lesson]);

    const useCase = new ReorderLessonUp(
      lessonRepository,
      courseRepository,
      eventBus
    );

    await expect(useCase.execute(command)).rejects.toThrow(
      UnableToReorderLessonError
    );
    expect(lessonRepository.update).not.toBeCalled();
  });

  it('Should not reorder a lesson if lesson do not exist', async () => {
    const course = new CourseBuilder().build();

    const lesson0 = new LessonBuilder()
      .withOrder(LessonOrder.of(0))
      .withCourseId(course.id)
      .build();
    const lesson = new LessonBuilder().withCourseId(course.id).build();

    const command = new ReorderLessonUpCommand({
      authorId: AuthorId.random().value,
      lessonId: lesson.id.value,
    });

    lessonRepository.findById.mockResolvedValue(null);
    courseRepository.findById.mockResolvedValue(null);
    lessonRepository.findByCourseId.mockResolvedValueOnce([lesson0]);

    const useCase = new ReorderLessonUp(
      lessonRepository,
      courseRepository,
      eventBus
    );

    await expect(useCase.execute(command)).rejects.toThrow(LessonNotFoundError);
    expect(lessonRepository.update).not.toHaveBeenCalled();
  });

  it('Should not reorder a lesson if course is not authored', async () => {
    const course = new CourseBuilder().build();

    const lesson0 = new LessonBuilder()
      .withOrder(LessonOrder.of(0))
      .withCourseId(course.id)
      .build();
    const lesson = new LessonBuilder().withCourseId(course.id).build();

    const command = new ReorderLessonUpCommand({
      authorId: AuthorId.random().value,
      lessonId: lesson.id.value,
    });

    lessonRepository.findById.mockResolvedValue(lesson);
    courseRepository.findById.mockResolvedValue(course);
    lessonRepository.findByCourseId.mockResolvedValueOnce([lesson0, lesson]);

    const useCase = new ReorderLessonUp(
      lessonRepository,
      courseRepository,
      eventBus
    );

    await expect(useCase.execute(command)).rejects.toThrow(CourseNotFoundError);
    expect(lessonRepository.update).not.toHaveBeenCalled();
  });

  it('Should not reorder a lesson if course do not exist', async () => {
    const course = new CourseBuilder().build();

    const lesson0 = new LessonBuilder()
      .withOrder(LessonOrder.of(0))
      .withCourseId(course.id)
      .build();
    const lesson = new LessonBuilder().withCourseId(course.id).build();

    const command = new ReorderLessonUpCommand({
      authorId: AuthorId.random().value,
      lessonId: lesson.id.value,
    });

    lessonRepository.findById.mockResolvedValue(lesson);
    courseRepository.findById.mockResolvedValue(null);
    lessonRepository.findByCourseId.mockResolvedValueOnce([lesson0, lesson]);

    const useCase = new ReorderLessonUp(
      lessonRepository,
      courseRepository,
      eventBus
    );

    await expect(useCase.execute(command)).rejects.toThrow(CourseNotFoundError);
    expect(lessonRepository.update).not.toHaveBeenCalled();
  });
});
