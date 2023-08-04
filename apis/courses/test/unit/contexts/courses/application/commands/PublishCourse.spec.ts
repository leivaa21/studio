import { mock, mockReset } from 'jest-mock-extended';
import {
  PublishCourse,
  PublishCourseCommand,
} from '../../../../../../src/contexts/courses/application/commands/PublishCourse';
import { CourseRepository } from '../../../../../../src/contexts/courses/domain/CourseRepository';
import { EventBus } from '../../../../../../src/contexts/shared/domain/EventBus';
import { CourseBuilder } from '../../../../../helpers/builders/CourseBuilder';
import { CourseNotFoundError } from '../../../../../../src/contexts/courses/domain/errors/CourseNotFoundError';
import { AuthorId } from '../../../../../../src/contexts/courses/domain/AuthorId';
import { NotAbleToPublishCourseError } from '../../../../../../src/contexts/courses/domain/errors/NotAbleToPublishCourseError';

describe('Publish an existant course', () => {
  const courseRepository = mock<CourseRepository>();
  const eventBus = mock<EventBus>();

  beforeEach(() => {
    mockReset(courseRepository);
    mockReset(eventBus);
  });

  it('Should let author publish an existant non-published course', async () => {
    const course = new CourseBuilder().build();

    courseRepository.findById.mockResolvedValue(course);
    courseRepository.update.mockResolvedValue();

    const useCase = new PublishCourse(courseRepository, eventBus);

    const command = new PublishCourseCommand({
      authorId: course.authorId.value,
      courseId: course.id.value,
    });

    await expect(useCase.execute(command)).resolves.not.toThrow();
    expect(courseRepository.update).toBeCalled();
    expect(eventBus.publish).toBeCalled();
  });

  it('Should not let publish a course that not exist', async () => {
    const course = new CourseBuilder().build();

    courseRepository.findById.mockResolvedValue(null);

    const useCase = new PublishCourse(courseRepository, eventBus);

    const command = new PublishCourseCommand({
      authorId: course.authorId.value,
      courseId: course.id.value,
    });

    await expect(useCase.execute(command)).rejects.toThrow(CourseNotFoundError);
  });

  it('Should not let publish a course by an user thats not the author', async () => {
    const course = new CourseBuilder().build();

    courseRepository.findById.mockResolvedValue(course);

    const useCase = new PublishCourse(courseRepository, eventBus);

    const command = new PublishCourseCommand({
      authorId: AuthorId.random().value,
      courseId: course.id.value,
    });

    await expect(useCase.execute(command)).rejects.toThrow(CourseNotFoundError);
  });

  it('Should not publish a course if its already published', async () => {
    const course = new CourseBuilder().withPublishedAt(new Date()).build();

    courseRepository.findById.mockResolvedValue(course);

    const useCase = new PublishCourse(courseRepository, eventBus);

    const command = new PublishCourseCommand({
      authorId: course.authorId.value,
      courseId: course.id.value,
    });

    await expect(useCase.execute(command)).rejects.toThrow(
      NotAbleToPublishCourseError
    );
  });
});
