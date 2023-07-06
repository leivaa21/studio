import { mock, mockReset } from 'jest-mock-extended';
import { CourseRepository } from '../../../../../../src/contexts/courses/domain/CourseRepository';
import {
  CreateNewCourse,
  CreateNewCourseCommand,
} from '../../../../../../src/contexts/courses/application/commands/CreateNewCourse';
import { AuthorId } from '../../../../../../src/contexts/courses/domain/AuthorId';
import { StringMother } from '../../../../../helpers/object-mother/StringMother';
import { EventBus } from '../../../../../../src/contexts/shared/domain/EventBus';

describe('Create new course', () => {
  const courseRepository = mock<CourseRepository>();
  const eventBus = mock<EventBus>();

  beforeEach(() => {
    mockReset(courseRepository);
    mockReset(eventBus);
  });

  it('Should create a new course', async () => {
    const command = new CreateNewCourseCommand({
      authorId: AuthorId.random().value,
      title: StringMother.random(),
      description: StringMother.random(),
    });

    const useCase = new CreateNewCourse(courseRepository, eventBus);

    await expect(useCase.execute(command)).resolves.not.toThrow();
    expect(courseRepository.create).toBeCalled();
    expect(eventBus.publish).toBeCalled();
  });
});
