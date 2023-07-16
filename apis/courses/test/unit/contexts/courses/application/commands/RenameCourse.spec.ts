import { mock, mockReset } from 'jest-mock-extended';
import {
  RenameCourse,
  RenameCourseCommand,
} from '../../../../../../src/contexts/courses/application/commands/RenameCourse';
import { CourseRepository } from '../../../../../../src/contexts/courses/domain/CourseRepository';
import { EventBus } from '../../../../../../src/contexts/shared/domain/EventBus';
import { CourseBuilder } from '../../../../../helpers/builders/CourseBuilder';
import { StringMother } from '../../../../../helpers/object-mother/StringMother';

describe('Rename a existant course', () => {
  const courseRepository = mock<CourseRepository>();
  const eventBus = mock<EventBus>();

  beforeEach(() => {
    mockReset(courseRepository);
    mockReset(eventBus);
  });

  it('Should let author rename a existant course', async () => {
    const course = new CourseBuilder().build();

    courseRepository.findById.mockResolvedValue(course);
    courseRepository.update.mockResolvedValue();

    const useCase = new RenameCourse(courseRepository, eventBus);

    const command = new RenameCourseCommand({
      authorId: course.authorId.value,
      courseId: course.id.value,
      title: StringMother.random(),
    });

    await expect(useCase.execute(command)).resolves.not.toThrow();
    expect(courseRepository.update).toBeCalled();
    expect(eventBus.publish).toBeCalled();
  });
});
