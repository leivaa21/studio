import { mock, mockReset } from 'jest-mock-extended';
import {
  UnpublishCourse,
  UnpublishCourseCommand,
} from '../../../../../../src/contexts/courses/application/commands/UnpublishCourse';
import { CourseRepository } from '../../../../../../src/contexts/courses/domain/CourseRepository';
import { EventBus } from '../../../../../../src/contexts/shared/domain/EventBus';
import { CourseBuilder } from '../../../../../helpers/builders/CourseBuilder';
import { CourseNotFoundError } from '../../../../../../src/contexts/courses/domain/errors/CourseNotFoundError';
import { AuthorId } from '../../../../../../src/contexts/courses/domain/AuthorId';
import { NotAbleToUnpublishCourseError } from '../../../../../../src/contexts/courses/domain/errors/NotAbleToUnpublishCourseError';

describe('Unpublish an existant published course', () => {
  const courseRepository = mock<CourseRepository>();
  const eventBus = mock<EventBus>();

  beforeEach(() => {
    mockReset(courseRepository);
    mockReset(eventBus);
  });

  it('Should let author unpublish an existant published course', async () => {
    const course = new CourseBuilder().withPublishedAt(new Date()).build();

    courseRepository.findById.mockResolvedValue(course);
    courseRepository.update.mockResolvedValue();

    const useCase = new UnpublishCourse(courseRepository, eventBus);

    const command = new UnpublishCourseCommand({
      authorId: course.authorId.value,
      courseId: course.id.value,
    });

    await expect(useCase.execute(command)).resolves.not.toThrow();
    expect(courseRepository.update).toBeCalled();
    expect(eventBus.publish).toBeCalled();
  });

  it('Should not let unpublish a course that not exist', async () => {
    const course = new CourseBuilder().build();

    courseRepository.findById.mockResolvedValue(null);

    const useCase = new UnpublishCourse(courseRepository, eventBus);

    const command = new UnpublishCourseCommand({
      authorId: course.authorId.value,
      courseId: course.id.value,
    });

    await expect(useCase.execute(command)).rejects.toThrow(CourseNotFoundError);
  });

  it('Should not let unpublish a course by an user thats not the author', async () => {
    const course = new CourseBuilder().build();

    courseRepository.findById.mockResolvedValue(course);

    const useCase = new UnpublishCourse(courseRepository, eventBus);

    const command = new UnpublishCourseCommand({
      authorId: AuthorId.random().value,
      courseId: course.id.value,
    });

    await expect(useCase.execute(command)).rejects.toThrow(CourseNotFoundError);
  });

  it('Should not unpublish a course if its not published', async () => {
    const course = new CourseBuilder().build();

    courseRepository.findById.mockResolvedValue(course);

    const useCase = new UnpublishCourse(courseRepository, eventBus);

    const command = new UnpublishCourseCommand({
      authorId: course.authorId.value,
      courseId: course.id.value,
    });

    await expect(useCase.execute(command)).rejects.toThrow(
      NotAbleToUnpublishCourseError
    );
  });
});
