import {
  Authorized,
  CurrentUser,
  Get,
  HttpCode,
  JsonController,
} from 'routing-controllers';

import { Injectable } from '@studio/dependency-injection';
import { StatusCode } from '@studio/api-utils';

import { QueryBus } from '../../../contexts/shared/domain/QueryBus';
import { InMemoryQueryBus } from '../../../contexts/shared/infrastructure/QueryBus/InMemoryQueryBus';
import { User } from '../../auth/user';
import { GetConsumerStatsQuery } from '../../../contexts/consumer-stats/application/queries/GetConsumerStats';
import { ConsumerStats } from '../../../contexts/consumer-stats/domain/ConsumerStats';
import { ApiError, ErrorCodes } from '@studio/commons';

@Injectable({
  dependencies: [InMemoryQueryBus],
})
@JsonController('/has-consumer-stats')
export class UserHasConsumerStatsController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get()
  @HttpCode(StatusCode.OK)
  @Authorized()
  public async execute(
    @CurrentUser({ required: true }) user: User
  ): Promise<{ hasConsumerStats: boolean }> {
    try {
      await this.queryBus.dispatch<GetConsumerStatsQuery, ConsumerStats>(
        new GetConsumerStatsQuery({
          userId: user.id,
        })
      );

      return {
        hasConsumerStats: true,
      };
    } catch (err) {
      if ((err as ApiError).errorCode === ErrorCodes.ConsumerStatsNotFound) {
        return { hasConsumerStats: false };
      }
      throw err;
    }
  }
}
