import { mock, mockReset } from 'jest-mock-extended';
import {
  GetLessonsByCourse,
  GetLessonsByCourseQuery,
} from '../../../../../../src/contexts/lessons/application/queries/GetLessonsByCourse';
import { LessonRepository } from '../../../../../../src/contexts/lessons/domain/LessonRepository';
import { LessonBuilder } from '../../../../../helpers/builders/LessonBuilder';
import { CourseBuilder } from '../../../../../helpers/builders/CourseBuilder';

describe('Get course lessons by course id', () => {
  const lessonRepository = mock<LessonRepository>();

  beforeEach(() => {
    mockReset(lessonRepository);
  });

  it('Should find existant lessons with given courseId', async () => {
    const course = new CourseBuilder().build();
    const lesson = new LessonBuilder().withCourseId(course.id).build();
    const query = new GetLessonsByCourseQuery({ courseId: course.id.value });

    lessonRepository.findByCourseId.mockResolvedValue([lesson]);

    const useCase = new GetLessonsByCourse(lessonRepository);

    expect(useCase.execute(query)).resolves.toEqual([lesson]);
  });
});
