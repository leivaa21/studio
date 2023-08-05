import { mock, mockReset } from 'jest-mock-extended';
import { CourseRepository } from '../../../../../../src/contexts/courses/domain/CourseRepository';
import { LessonRepository } from '../../../../../../src/contexts/lessons/domain/LessonRepository';
import {
  UpdateLesson,
  UpdateLessonCommand,
} from '../../../../../../src/contexts/lessons/application/commands/UpdateLesson';
import { EventBus } from '../../../../../../src/contexts/shared/domain/EventBus';
import { CourseBuilder } from '../../../../../helpers/builders/CourseBuilder';
import { LessonBuilder } from '../../../../../helpers/builders/LessonBuilder';
import { AuthorId } from '../../../../../../src/contexts/courses/domain/AuthorId';
import { CourseNotFoundError } from '../../../../../../src/contexts/courses/domain/errors/CourseNotFoundError';
import { StringMother } from '../../../../../helpers/object-mother/StringMother';
import { MAX_LESSON_TITLE_LENGTH } from '@studio/commons';
import { InvalidLessonTitleError } from '../../../../../../src/contexts/lessons/domain/errors/InvalidLessonTitleError';
import { LessonNotFoundError } from '../../../../../../src/contexts/lessons/domain/errors/LessonNotFoundError';

describe('Update an existant lesson', () => {
  const lessonRepository = mock<LessonRepository>();
  const courseRepository = mock<CourseRepository>();
  const eventBus = mock<EventBus>();

  beforeEach(() => {
    mockReset(lessonRepository);
    mockReset(courseRepository);
    mockReset(eventBus);
  });

  it('Should update a existant lesson on a authored course', async () => {
    const course = new CourseBuilder().build();

    const lesson = new LessonBuilder().withCourseId(course.id).build();

    const { title, content } = new LessonBuilder().build();

    const command = new UpdateLessonCommand({
      authorId: course.authorId.value,
      lessonId: lesson.id.value,
      title: title.value,
      content: content.value,
    });

    lessonRepository.findById.mockResolvedValue(lesson);
    courseRepository.findById.mockResolvedValue(course);

    const useCase = new UpdateLesson(
      lessonRepository,
      courseRepository,
      eventBus
    );

    await expect(useCase.execute(command)).resolves.not.toThrow();
    expect(lessonRepository.update).toBeCalledWith(
      expect.objectContaining({
        title,
        content,
      })
    );
    expect(eventBus.publish).toBeCalled();
  });

  it('Should not update a lesson if course is not authored', async () => {
    const course = new CourseBuilder().build();

    const lesson = new LessonBuilder().withCourseId(course.id).build();

    const { title, content } = new LessonBuilder().build();

    const command = new UpdateLessonCommand({
      authorId: AuthorId.random().value,
      lessonId: lesson.id.value,
      title: title.value,
      content: content.value,
    });

    lessonRepository.findById.mockResolvedValue(lesson);
    courseRepository.findById.mockResolvedValue(course);

    const useCase = new UpdateLesson(
      lessonRepository,
      courseRepository,
      eventBus
    );

    await expect(useCase.execute(command)).rejects.toThrow(CourseNotFoundError);
    expect(lessonRepository.create).not.toHaveBeenCalled();
  });

  it('Should not update a lesson if course do not exist', async () => {
    const course = new CourseBuilder().build();

    const lesson = new LessonBuilder().withCourseId(course.id).build();

    const { title, content } = new LessonBuilder().build();

    const command = new UpdateLessonCommand({
      authorId: AuthorId.random().value,
      lessonId: lesson.id.value,
      title: title.value,
      content: content.value,
    });

    lessonRepository.findById.mockResolvedValue(lesson);
    courseRepository.findById.mockResolvedValue(null);

    const useCase = new UpdateLesson(
      lessonRepository,
      courseRepository,
      eventBus
    );

    await expect(useCase.execute(command)).rejects.toThrow(CourseNotFoundError);
    expect(lessonRepository.create).not.toHaveBeenCalled();
  });

  it('Should not update a lesson if do not exist', async () => {
    const course = new CourseBuilder().build();

    const lesson = new LessonBuilder().withCourseId(course.id).build();

    const { title, content } = new LessonBuilder().build();

    const command = new UpdateLessonCommand({
      authorId: AuthorId.random().value,
      lessonId: lesson.id.value,
      title: title.value,
      content: content.value,
    });

    lessonRepository.findById.mockResolvedValue(null);
    courseRepository.findById.mockResolvedValue(course);

    const useCase = new UpdateLesson(
      lessonRepository,
      courseRepository,
      eventBus
    );

    await expect(useCase.execute(command)).rejects.toThrow(LessonNotFoundError);
    expect(lessonRepository.create).not.toHaveBeenCalled();
  });

  it('Should not update a lesson if the new title is not valid', async () => {
    const course = new CourseBuilder().build();

    const lesson = new LessonBuilder().withCourseId(course.id).build();

    const { content } = new LessonBuilder().build();

    const command = new UpdateLessonCommand({
      authorId: course.authorId.value,
      lessonId: lesson.id.value,
      title: StringMother.random({ length: MAX_LESSON_TITLE_LENGTH + 1 }),
      content: content.value,
    });

    lessonRepository.findById.mockResolvedValue(lesson);
    courseRepository.findById.mockResolvedValue(course);

    const useCase = new UpdateLesson(
      lessonRepository,
      courseRepository,
      eventBus
    );

    await expect(useCase.execute(command)).rejects.toThrow(
      InvalidLessonTitleError
    );
    expect(lessonRepository.create).not.toHaveBeenCalled();
  });
});
