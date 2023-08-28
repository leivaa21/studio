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
import { GetAuthorStatsQuery } from '../../../contexts/author-stats/application/queries/GetAuthorStats';
import { AuthorStats } from '../../../contexts/author-stats/domain/AuthorStats';
import { ApiError, ErrorCodes } from '@studio/commons';

@Injectable({
  dependencies: [InMemoryQueryBus],
})
@JsonController('/has-author-stats')
export class UserHasAuthorStatsController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get()
  @HttpCode(StatusCode.OK)
  @Authorized()
  public async execute(
    @CurrentUser({ required: true }) user: User
  ): Promise<{ hasAuthorStats: boolean }> {
    try {
      await this.queryBus.dispatch<GetAuthorStatsQuery, AuthorStats>(
        new GetAuthorStatsQuery({
          authorId: user.id,
        })
      );
      return {
        hasAuthorStats: true,
      };
    } catch (err) {
      if ((err as ApiError).errorCode === ErrorCodes.AuthorStatsNotFound) {
        return { hasAuthorStats: false };
      }
      throw err;
    }
  }
}
