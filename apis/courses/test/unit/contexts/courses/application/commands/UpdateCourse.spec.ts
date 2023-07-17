import { mock, mockReset } from 'jest-mock-extended';
import {
  UpdateCourse,
  UpdateCourseCommand,
} from '../../../../../../src/contexts/courses/application/commands/UpdateCourse';
import { CourseRepository } from '../../../../../../src/contexts/courses/domain/CourseRepository';
import { EventBus } from '../../../../../../src/contexts/shared/domain/EventBus';
import { CourseBuilder } from '../../../../../helpers/builders/CourseBuilder';
import { StringMother } from '../../../../../helpers/object-mother/StringMother';
import { CourseNotFoundError } from '../../../../../../src/contexts/courses/domain/errors/CourseNotFoundError';
import { AuthorId } from '../../../../../../src/contexts/courses/domain/AuthorId';

describe('Update an existant course', () => {
  const courseRepository = mock<CourseRepository>();
  const eventBus = mock<EventBus>();

  beforeEach(() => {
    mockReset(courseRepository);
    mockReset(eventBus);
  });

  it('Should let author rename an existant course', async () => {
    const course = new CourseBuilder().build();

    courseRepository.findById.mockResolvedValue(course);
    courseRepository.update.mockResolvedValue();

    const useCase = new UpdateCourse(courseRepository, eventBus);

    const command = new UpdateCourseCommand({
      authorId: course.authorId.value,
      courseId: course.id.value,
      title: StringMother.random(),
      description: course.description.value,
    });

    await expect(useCase.execute(command)).resolves.not.toThrow();
    expect(courseRepository.update).toBeCalled();
    expect(eventBus.publish).toBeCalled();
  });

  it('Should let author update description of an existant course', async () => {
    const course = new CourseBuilder().build();

    courseRepository.findById.mockResolvedValue(course);
    courseRepository.update.mockResolvedValue();

    const useCase = new UpdateCourse(courseRepository, eventBus);

    const command = new UpdateCourseCommand({
      authorId: course.authorId.value,
      courseId: course.id.value,
      title: StringMother.random(),
      description: course.description.value,
    });

    await expect(useCase.execute(command)).resolves.not.toThrow();
    expect(courseRepository.update).toBeCalled();
    expect(eventBus.publish).toBeCalled();
  });

  it('Should not let update a course that not exist', async () => {
    const course = new CourseBuilder().build();

    courseRepository.findById.mockResolvedValue(null);

    const useCase = new UpdateCourse(courseRepository, eventBus);

    const command = new UpdateCourseCommand({
      authorId: course.authorId.value,
      courseId: course.id.value,
      title: course.title.value,
      description: course.description.value,
    });

    await expect(useCase.execute(command)).rejects.toThrow(CourseNotFoundError);
  });

  it('Should not update a course by an user thats not the author', async () => {
    const course = new CourseBuilder().build();

    courseRepository.findById.mockResolvedValue(course);

    const useCase = new UpdateCourse(courseRepository, eventBus);

    const command = new UpdateCourseCommand({
      authorId: AuthorId.random().value,
      courseId: course.id.value,
      title: course.title.value,
      description: course.description.value,
    });

    await expect(useCase.execute(command)).rejects.toThrow(CourseNotFoundError);
  });
});
