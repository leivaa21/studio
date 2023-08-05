import { mock, mockReset } from 'jest-mock-extended';
import { CourseRepository } from '../../../../../../src/contexts/courses/domain/CourseRepository';
import { LessonRepository } from '../../../../../../src/contexts/lessons/domain/LessonRepository';
import {
  CreateNewLesson,
  CreateNewLessonCommand,
} from '../../../../../../src/contexts/lessons/application/commands/CreateNewLesson';
import { EventBus } from '../../../../../../src/contexts/shared/domain/EventBus';
import { CourseBuilder } from '../../../../../helpers/builders/CourseBuilder';
import { LessonBuilder } from '../../../../../helpers/builders/LessonBuilder';
import { LessonTitle } from '../../../../../../src/contexts/lessons/domain/LessonTitle';
import { LessonOrder } from '../../../../../../src/contexts/lessons/domain/LessonOrder';
import { AuthorId } from '../../../../../../src/contexts/courses/domain/AuthorId';
import { CourseNotFoundError } from '../../../../../../src/contexts/courses/domain/errors/CourseNotFoundError';
import { StringMother } from '../../../../../helpers/object-mother/StringMother';
import { MAX_LESSON_TITLE_LENGTH } from '@studio/commons';
import { InvalidLessonTitleError } from '../../../../../../src/contexts/lessons/domain/errors/InvalidLessonTitleError';

describe('Create new Lesson', () => {
  const lessonRepository = mock<LessonRepository>();
  const courseRepository = mock<CourseRepository>();
  const eventBus = mock<EventBus>();

  beforeEach(() => {
    mockReset(lessonRepository);
    mockReset(courseRepository);
    mockReset(eventBus);
  });

  it('Should create a new lesson on a course with no lessons', async () => {
    const course = new CourseBuilder().build();

    const { title, content } = new LessonBuilder()
      .withCourseId(course.id)
      .build();

    const command = new CreateNewLessonCommand({
      authorId: course.authorId.value,
      courseId: course.id.value,
      title: title.value,
      content: content.value,
    });

    courseRepository.findById.mockResolvedValue(course);
    lessonRepository.findByCourseId.mockResolvedValue([]);

    const useCase = new CreateNewLesson(
      lessonRepository,
      courseRepository,
      eventBus
    );

    await expect(useCase.execute(command)).resolves.not.toThrow();
    expect(lessonRepository.create).toBeCalledWith(
      expect.objectContaining({
        title: LessonTitle.of(command.title),
        order: LessonOrder.of(0),
      })
    );
    expect(eventBus.publish).toBeCalled();
  });

  it('Should create a new lesson on a course with more lessons', async () => {
    const course = new CourseBuilder().build();

    const { title, content } = new LessonBuilder()
      .withCourseId(course.id)
      .build();

    const previousLessons = [
      new LessonBuilder().withCourseId(course.id).build(),
      new LessonBuilder().withCourseId(course.id).build(),
    ];

    const command = new CreateNewLessonCommand({
      authorId: course.authorId.value,
      courseId: course.id.value,
      title: title.value,
      content: content.value,
    });

    courseRepository.findById.mockResolvedValue(course);
    lessonRepository.findByCourseId.mockResolvedValue(previousLessons);

    const useCase = new CreateNewLesson(
      lessonRepository,
      courseRepository,
      eventBus
    );

    await expect(useCase.execute(command)).resolves.not.toThrow();
    expect(lessonRepository.create).toBeCalledWith(
      expect.objectContaining({
        title: LessonTitle.of(command.title),
        order: LessonOrder.of(previousLessons.length),
      })
    );
    expect(eventBus.publish).toBeCalled();
  });

  it('Should not create a new lesson if course is not authored', async () => {
    const course = new CourseBuilder().build();

    const { title, content } = new LessonBuilder()
      .withCourseId(course.id)
      .build();

    const command = new CreateNewLessonCommand({
      authorId: AuthorId.random().value,
      courseId: course.id.value,
      title: title.value,
      content: content.value,
    });

    courseRepository.findById.mockResolvedValue(course);
    lessonRepository.findByCourseId.mockResolvedValue([]);

    const useCase = new CreateNewLesson(
      lessonRepository,
      courseRepository,
      eventBus
    );

    await expect(useCase.execute(command)).rejects.toThrow(CourseNotFoundError);
    expect(lessonRepository.create).not.toHaveBeenCalled();
  });

  it('Should not create a new lesson if course do not exist', async () => {
    const course = new CourseBuilder().build();

    const { title, content } = new LessonBuilder()
      .withCourseId(course.id)
      .build();

    const command = new CreateNewLessonCommand({
      authorId: course.authorId.value,
      courseId: course.id.value,
      title: title.value,
      content: content.value,
    });

    courseRepository.findById.mockResolvedValue(null);
    lessonRepository.findByCourseId.mockResolvedValue([]);

    const useCase = new CreateNewLesson(
      lessonRepository,
      courseRepository,
      eventBus
    );

    await expect(useCase.execute(command)).rejects.toThrow(CourseNotFoundError);
    expect(lessonRepository.create).not.toHaveBeenCalled();
  });

  it('Should not create a new lesson if title is not valid', async () => {
    const course = new CourseBuilder().build();

    const { content } = new LessonBuilder().withCourseId(course.id).build();

    const command = new CreateNewLessonCommand({
      authorId: course.authorId.value,
      courseId: course.id.value,
      title: StringMother.random({ length: MAX_LESSON_TITLE_LENGTH + 1 }),
      content: content.value,
    });

    courseRepository.findById.mockResolvedValue(course);
    lessonRepository.findByCourseId.mockResolvedValue([]);

    const useCase = new CreateNewLesson(
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
