import { Injectable } from '@studio/dependency-injection';
import { QueryHandler } from '../../../shared/application/QueryHandler';
import { AuthorStats } from '../../domain/AuthorStats';
import { AuthorStatsFinder } from '../services/AuthorStatsFinder';
import { AuthorStatsRepository } from '../../domain/AuthorStatsRepository';
import { AuthorId } from '../../../courses/domain/AuthorId';
import { MongoAuthorStatsRepository } from '../../infrastructure/persistance/mongo/MongoAuthorStatsRepository';

export class GetAuthorStatsQuery {
  public readonly authorId: string;

  public constructor(params: { authorId: string }) {
    this.authorId = params.authorId;
  }
}

@Injectable({
  dependencies: [MongoAuthorStatsRepository],
})
export class GetAuthorStats
  implements QueryHandler<GetAuthorStatsQuery, AuthorStats>
{
  private readonly authorStatsFinder: AuthorStatsFinder;

  public constructor(authorStatsRepository: AuthorStatsRepository) {
    this.authorStatsFinder = new AuthorStatsFinder(authorStatsRepository);
  }
  public async execute(query: GetAuthorStatsQuery): Promise<AuthorStats> {
    const authorId = AuthorId.of(query.authorId);

    const authorStats = await this.authorStatsFinder.findOrThrow(authorId);

    return authorStats;
  }
}
