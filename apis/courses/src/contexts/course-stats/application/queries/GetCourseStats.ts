import { Injectable } from '@studio/dependency-injection';
import { QueryHandler } from '../../../shared/application/QueryHandler';
import { MongoCourseStatsRepository } from '../../infrastructure/persistance/mongo/MongoCourseStatsRepository';
import { CourseStatsFinder } from '../services/CourseStatsFinder';
import { CourseStats } from '../../domain/CourseStats';
import { CourseId } from '../../../courses/domain/CourseId';
import { CourseStatsRepository } from '../../domain/CourseStatsRepository';

export class GetCourseStatsQuery {
  public readonly courseId: string;

  public constructor(params: { courseId: string }) {
    this.courseId = params.courseId;
  }
}

@Injectable({
  dependencies: [MongoCourseStatsRepository],
})
export class GetCourseStats
  implements QueryHandler<GetCourseStatsQuery, CourseStats>
{
  private readonly courseStatsFinder: CourseStatsFinder;

  public constructor(courseStatsRepository: CourseStatsRepository) {
    this.courseStatsFinder = new CourseStatsFinder(courseStatsRepository);
  }
  public async execute(query: GetCourseStatsQuery): Promise<CourseStats> {
    const courseId = CourseId.of(query.courseId);

    const courseStats = await this.courseStatsFinder.findOrThrow(courseId);

    return courseStats;
  }
}
