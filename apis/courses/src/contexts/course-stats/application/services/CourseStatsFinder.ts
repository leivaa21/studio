import { CourseId } from '../../../courses/domain/CourseId';
import { CourseStats } from '../../domain/CourseStats';
import { CourseStatsRepository } from '../../domain/CourseStatsRepository';
import { CourseStatsNotFoundError } from '../../domain/errors/CourseStatsNotFound';

export class CourseStatsFinder {
  constructor(private readonly courseStatsRepository: CourseStatsRepository) {}

  public async findOrThrow(courseId: CourseId): Promise<CourseStats> {
    const courseStats = await this.courseStatsRepository.find(courseId);

    if (!courseStats) {
      throw CourseStatsNotFoundError.searchedByCourse(courseId.value);
    }

    return courseStats;
  }
}
