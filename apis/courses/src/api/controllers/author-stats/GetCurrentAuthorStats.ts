import {
  Authorized,
  CurrentUser,
  Get,
  HttpCode,
  JsonController,
} from 'routing-controllers';

import { Injectable } from '@studio/dependency-injection';
import { StatusCode } from '@studio/api-utils';
import { CurrentAuthorStatsResponse } from '@studio/commons';

import { QueryBus } from '../../../contexts/shared/domain/QueryBus';
import { User } from '../../auth/user';
import { GetAuthorStatsQuery } from '../../../contexts/author-stats/application/queries/GetAuthorStats';
import { AuthorStats } from '../../../contexts/author-stats/domain/AuthorStats';

@Injectable({
  dependencies: [QueryBus],
})
@JsonController('/author-stats')
export class GetCurrentAuthorStatsController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get()
  @HttpCode(StatusCode.OK)
  @Authorized()
  public async execute(
    @CurrentUser({ required: true }) user: User
  ): Promise<CurrentAuthorStatsResponse> {
    const authorStats = await this.queryBus.dispatch<
      GetAuthorStatsQuery,
      AuthorStats
    >(
      new GetAuthorStatsQuery({
        authorId: user.id,
      })
    );

    return {
      authorId: authorStats.authorId.value,
      currentCourses: authorStats.currentCourses.value,
      currentCoursesPublished: authorStats.currentPublishedCourses.value,
      currentLessons: authorStats.currentLessons.value,
      currentSubscriptionsToOwnCourses:
        authorStats.currentSubscriptionsToOwnCourses.value,
    };
  }
}
