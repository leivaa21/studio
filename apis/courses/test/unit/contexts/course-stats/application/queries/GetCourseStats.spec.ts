import { mock, mockReset } from 'jest-mock-extended';
import {
  GetCourseStats,
  GetCourseStatsQuery,
} from '../../../../../../src/contexts/course-stats/application/queries/GetCourseStats';
import { CourseStatsRepository } from '../../../../../../src/contexts/course-stats/domain/CourseStatsRepository';
import { CourseStatsBuilder } from '../../../../../helpers/builders/CourseStatsBuilder';
import { CourseStatsNotFoundError } from '../../../../../../src/contexts/course-stats/domain/errors/CourseStatsNotFound';

describe('Get existant course stats by course id', () => {
  const courseStatsRepository = mock<CourseStatsRepository>();

  beforeEach(() => {
    mockReset(courseStatsRepository);
  });

  it('Should find an existant course stats', async () => {
    const courseStats = new CourseStatsBuilder().build();
    const query = new GetCourseStatsQuery({
      courseId: courseStats.courseId.value,
    });

    courseStatsRepository.find.mockResolvedValue(courseStats);

    const useCase = new GetCourseStats(courseStatsRepository);

    expect(useCase.execute(query)).resolves.toEqual(courseStats);
  });

  it('Should throw NotFoundError on course stats not found', async () => {
    const courseStats = new CourseStatsBuilder().build();
    const query = new GetCourseStatsQuery({
      courseId: courseStats.courseId.value,
    });

    courseStatsRepository.find.mockResolvedValue(null);

    const useCase = new GetCourseStats(courseStatsRepository);

    expect(useCase.execute(query)).rejects.toThrow(CourseStatsNotFoundError);
  });
});
