import {
  Authorized,
  CurrentUser,
  Get,
  HttpCode,
  JsonController,
} from 'routing-controllers';

import { Injectable } from '@studio/dependency-injection';
import { StatusCode } from '@studio/api-utils';
import { CurrentConsumerStatsResponse } from '@studio/commons';

import { QueryBus } from '../../../contexts/shared/domain/QueryBus';
import { User } from '../../auth/user';
import { GetConsumerStatsQuery } from '../../../contexts/consumer-stats/application/queries/GetConsumerStats';
import { ConsumerStats } from '../../../contexts/consumer-stats/domain/ConsumerStats';

@Injectable({
  dependencies: [QueryBus],
})
@JsonController('/consumer-stats')
export class GetCurrentConsumerStatsController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get()
  @HttpCode(StatusCode.OK)
  @Authorized()
  public async execute(
    @CurrentUser({ required: true }) user: User
  ): Promise<CurrentConsumerStatsResponse> {
    const consumerStats = await this.queryBus.dispatch<
      GetConsumerStatsQuery,
      ConsumerStats
    >(
      new GetConsumerStatsQuery({
        userId: user.id,
      })
    );

    return {
      userId: consumerStats.userId.value,
      currentSubscribedCourses: consumerStats.currentSubscribedCourses.value,
      currentCompletedCourses: consumerStats.currentCompletedCourses.value,
    };
  }
}
