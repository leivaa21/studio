import { Get, HttpCode, JsonController, Param } from 'routing-controllers';

import { Injectable } from '@studio/dependency-injection';
import { StatusCode } from '@studio/api-utils';
import { CurrentCourseStatsResponse } from '@studio/commons';

import { QueryBus } from '../../../contexts/shared/domain/QueryBus';
import { InMemoryQueryBus } from '../../../contexts/shared/infrastructure/QueryBus/InMemoryQueryBus';
import { GetCourseStatsQuery } from '../../../contexts/course-stats/application/queries/GetCourseStats';
import { CourseStats } from '../../../contexts/course-stats/domain/CourseStats';

@Injectable({
  dependencies: [InMemoryQueryBus],
})
@JsonController('/course-stats')
export class GetCurrentCourseStatsController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get('/:id')
  @HttpCode(StatusCode.OK)
  public async execute(
    @Param('id') courseId: string
  ): Promise<CurrentCourseStatsResponse> {
    const courseStats = await this.queryBus.dispatch<
      GetCourseStatsQuery,
      CourseStats
    >(
      new GetCourseStatsQuery({
        courseId: courseId,
      })
    );

    return {
      courseId: courseStats.courseId.value,
      currentSubscriptions: courseStats.currentSubscriptions.value,
      currentTimesCompleted: courseStats.currentTimesCompleted.value,
    };
  }
}
