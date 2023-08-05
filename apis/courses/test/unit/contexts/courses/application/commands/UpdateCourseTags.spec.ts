import { mock, mockReset } from 'jest-mock-extended';
import {
  UpdateCourseTags,
  UpdateCourseTagsCommand,
} from '../../../../../../src/contexts/courses/application/commands/UpdateCourseTags';
import { CourseRepository } from '../../../../../../src/contexts/courses/domain/CourseRepository';
import { EventBus } from '../../../../../../src/contexts/shared/domain/EventBus';
import { CourseBuilder } from '../../../../../helpers/builders/CourseBuilder';
import { CourseNotFoundError } from '../../../../../../src/contexts/courses/domain/errors/CourseNotFoundError';
import { AuthorId } from '../../../../../../src/contexts/courses/domain/AuthorId';
import { InvalidCourseTagsError } from '../../../../../../src/contexts/courses/domain/errors/InvalidCourseTagsError';

describe('Update tags of an existant course', () => {
  const courseRepository = mock<CourseRepository>();
  const eventBus = mock<EventBus>();

  beforeEach(() => {
    mockReset(courseRepository);
    mockReset(eventBus);
  });

  it('Should let author update tags of an existant course', async () => {
    const course = new CourseBuilder().build();
    const { tags } = new CourseBuilder().build();

    courseRepository.findById.mockResolvedValue(course);
    courseRepository.update.mockResolvedValue();

    const useCase = new UpdateCourseTags(courseRepository, eventBus);

    const command = new UpdateCourseTagsCommand({
      authorId: course.authorId.value,
      courseId: course.id.value,
      tags: tags.values,
    });

    await expect(useCase.execute(command)).resolves.not.toThrow();
    expect(courseRepository.update).toBeCalled();
    expect(eventBus.publish).toBeCalled();
  });

  it('Should not let update tags of a course that not exist', async () => {
    const course = new CourseBuilder().build();

    courseRepository.findById.mockResolvedValue(null);

    const useCase = new UpdateCourseTags(courseRepository, eventBus);

    const command = new UpdateCourseTagsCommand({
      authorId: course.authorId.value,
      courseId: course.id.value,
      tags: course.tags.values,
    });

    await expect(useCase.execute(command)).rejects.toThrow(CourseNotFoundError);
  });

  it('Should not update tags of a course by an user thats not the author', async () => {
    const course = new CourseBuilder().build();

    courseRepository.findById.mockResolvedValue(course);

    const useCase = new UpdateCourseTags(courseRepository, eventBus);

    const command = new UpdateCourseTagsCommand({
      authorId: AuthorId.random().value,
      courseId: course.id.value,
      tags: course.tags.values,
    });

    await expect(useCase.execute(command)).rejects.toThrow(CourseNotFoundError);
  });

  it('Should not update tags of a course if new tags are duplicated', async () => {
    const course = new CourseBuilder().build();

    courseRepository.findById.mockResolvedValue(course);

    const useCase = new UpdateCourseTags(courseRepository, eventBus);

    const command = new UpdateCourseTagsCommand({
      authorId: course.authorId.value,
      courseId: course.id.value,
      tags: ['Backend', 'Backend'],
    });

    await expect(useCase.execute(command)).rejects.toThrow(
      InvalidCourseTagsError
    );
  });

  it('Should not update tags of a course if new tags are more than allowed', async () => {
    const course = new CourseBuilder().build();

    courseRepository.findById.mockResolvedValue(course);

    const useCase = new UpdateCourseTags(courseRepository, eventBus);

    const command = new UpdateCourseTagsCommand({
      authorId: course.authorId.value,
      courseId: course.id.value,
      tags: ['Backend', 'Frontend', 'Personal', 'Habits'],
    });

    await expect(useCase.execute(command)).rejects.toThrow(
      InvalidCourseTagsError
    );
  });
});
