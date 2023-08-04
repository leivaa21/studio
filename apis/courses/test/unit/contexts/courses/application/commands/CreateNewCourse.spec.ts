import { mock, mockReset } from 'jest-mock-extended';
import { CourseRepository } from '../../../../../../src/contexts/courses/domain/CourseRepository';
import {
  CreateNewCourse,
  CreateNewCourseCommand,
} from '../../../../../../src/contexts/courses/application/commands/CreateNewCourse';
import { EventBus } from '../../../../../../src/contexts/shared/domain/EventBus';
import { CourseBuilder } from '../../../../../helpers/builders/CourseBuilder';
import { StringMother } from '../../../../../helpers/object-mother/StringMother';
import { InvalidArgumentError, MAX_COURSE_TITLE_LENGTH } from '@studio/commons';

describe('Create new course', () => {
  const courseRepository = mock<CourseRepository>();
  const eventBus = mock<EventBus>();

  beforeEach(() => {
    mockReset(courseRepository);
    mockReset(eventBus);
  });

  it('Should create a new course', async () => {
    const { authorId, title, description, tags } = new CourseBuilder().build();

    const command = new CreateNewCourseCommand({
      authorId: authorId.value,
      title: title.value,
      description: description.value,
      tags: tags.values,
    });

    const useCase = new CreateNewCourse(courseRepository, eventBus);

    await expect(useCase.execute(command)).resolves.not.toThrow();
    expect(courseRepository.create).toBeCalled();
    expect(eventBus.publish).toBeCalled();
  });

  it('Should not create a course if title is invalid', async () => {
    const { authorId, description, tags } = new CourseBuilder().build();

    const title = StringMother.random({ length: MAX_COURSE_TITLE_LENGTH + 1 });

    const command = new CreateNewCourseCommand({
      authorId: authorId.value,
      title: title,
      description: description.value,
      tags: tags.values,
    });

    const useCase = new CreateNewCourse(courseRepository, eventBus);

    await expect(useCase.execute(command)).rejects.toThrow(
      InvalidArgumentError
    );
  });

  it('Should not create a course if there are more than 3 tags', async () => {
    const { authorId, title, description } = new CourseBuilder().build();

    const command = new CreateNewCourseCommand({
      authorId: authorId.value,
      title: title.value,
      description: description.value,
      tags: ['Backend', 'Frontend', 'Habits', 'Personal'],
    });

    const useCase = new CreateNewCourse(courseRepository, eventBus);

    await expect(useCase.execute(command)).rejects.toThrow(
      InvalidArgumentError
    );
  });
});
