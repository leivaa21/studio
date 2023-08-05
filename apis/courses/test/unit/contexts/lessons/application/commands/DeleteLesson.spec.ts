import { mock, mockReset } from 'jest-mock-extended';
import { CourseRepository } from '../../../../../../src/contexts/courses/domain/CourseRepository';
import { LessonRepository } from '../../../../../../src/contexts/lessons/domain/LessonRepository';
import {
  DeleteLesson,
  DeleteLessonCommand,
} from '../../../../../../src/contexts/lessons/application/commands/DeleteLesson';
import { EventBus } from '../../../../../../src/contexts/shared/domain/EventBus';
import { CourseBuilder } from '../../../../../helpers/builders/CourseBuilder';
import { LessonBuilder } from '../../../../../helpers/builders/LessonBuilder';
import { AuthorId } from '../../../../../../src/contexts/courses/domain/AuthorId';
import { CourseNotFoundError } from '../../../../../../src/contexts/courses/domain/errors/CourseNotFoundError';

describe('Create new Lesson', () => {
  const lessonRepository = mock<LessonRepository>();
  const courseRepository = mock<CourseRepository>();
  const eventBus = mock<EventBus>();

  beforeEach(() => {
    mockReset(lessonRepository);
    mockReset(courseRepository);
    mockReset(eventBus);
  });

  it('Should delete an existant lesson from an authored course', async () => {
    const course = new CourseBuilder().build();

    const lesson = new LessonBuilder().withCourseId(course.id).build();

    const command = new DeleteLessonCommand({
      authorId: course.authorId.value,
      lessonId: lesson.id.value,
    });

    courseRepository.findById.mockResolvedValue(course);
    lessonRepository.findById.mockResolvedValue(lesson);

    const useCase = new DeleteLesson(
      lessonRepository,
      courseRepository,
      eventBus
    );

    await expect(useCase.execute(command)).resolves.not.toThrow();
    expect(lessonRepository.deleteById).toBeCalledWith(lesson.id);
    expect(eventBus.publish).toBeCalled();
  });

  it('Should not delete a lesson if course is not authored', async () => {
    const course = new CourseBuilder().build();

    const lesson = new LessonBuilder().withCourseId(course.id).build();

    const command = new DeleteLessonCommand({
      authorId: AuthorId.random().value,
      lessonId: lesson.id.value,
    });

    lessonRepository.findById.mockResolvedValue(lesson);
    courseRepository.findById.mockResolvedValue(course);

    const useCase = new DeleteLesson(
      lessonRepository,
      courseRepository,
      eventBus
    );

    await expect(useCase.execute(command)).rejects.toThrow(CourseNotFoundError);
    expect(lessonRepository.deleteById).not.toHaveBeenCalled();
  });

  it('Should not delete a lesson if course do not exist', async () => {
    const course = new CourseBuilder().build();

    const lesson = new LessonBuilder().withCourseId(course.id).build();

    const command = new DeleteLessonCommand({
      authorId: course.authorId.value,
      lessonId: lesson.id.value,
    });

    lessonRepository.findById.mockResolvedValue(lesson);
    courseRepository.findById.mockResolvedValue(null);

    const useCase = new DeleteLesson(
      lessonRepository,
      courseRepository,
      eventBus
    );

    await expect(useCase.execute(command)).rejects.toThrow(CourseNotFoundError);
    expect(lessonRepository.create).not.toHaveBeenCalled();
  });
});
