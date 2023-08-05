import { mock, mockReset } from 'jest-mock-extended';
import {
  GetCourseById,
  GetCourseByIdQuery,
} from '../../../../../../src/contexts/courses/application/queries/GetCourseById';
import { CourseRepository } from '../../../../../../src/contexts/courses/domain/CourseRepository';
import { CourseBuilder } from '../../../../../helpers/builders/CourseBuilder';
import { CourseNotFoundError } from '../../../../../../src/contexts/courses/domain/errors/CourseNotFoundError';

describe('Get existant course by id', () => {
  const courseRepository = mock<CourseRepository>();

  beforeEach(() => {
    mockReset(courseRepository);
  });

  it('Should find an existant course', async () => {
    const course = new CourseBuilder().build();
    const query = new GetCourseByIdQuery({ courseId: course.id.value });

    courseRepository.findById.mockResolvedValue(course);

    const useCase = new GetCourseById(courseRepository);

    expect(useCase.execute(query)).resolves.toEqual(course);
  });

  it('Should throw NotFoundError on course not found', async () => {
    const course = new CourseBuilder().build();
    const query = new GetCourseByIdQuery({ courseId: course.id.value });

    courseRepository.findById.mockResolvedValue(null);

    const useCase = new GetCourseById(courseRepository);

    expect(useCase.execute(query)).rejects.toThrow(CourseNotFoundError);
  });
});
