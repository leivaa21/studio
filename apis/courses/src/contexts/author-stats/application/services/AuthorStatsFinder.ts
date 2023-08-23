import { AuthorId } from '../../../courses/domain/AuthorId';
import { Nullable } from '../../../shared/domain/Nullable';
import { AuthorStats } from '../../domain/AuthorStats';
import { AuthorStatsRepository } from '../../domain/AuthorStatsRepository';
import { AuthorStatsNotFoundError } from '../../domain/errors/AuthorStatsNotFound';

export class AuthorStatsFinder {
  constructor(private readonly authorStatsRepository: AuthorStatsRepository) {}

  public async findOrThrow(authorId: AuthorId): Promise<AuthorStats> {
    const authorStats = await this.authorStatsRepository.find(authorId);

    if (!authorStats) {
      throw AuthorStatsNotFoundError.searchedByAuthor(authorId.value);
    }

    return authorStats;
  }

  public async find(authorId: AuthorId): Promise<Nullable<AuthorStats>> {
    const authorStats = await this.authorStatsRepository.find(authorId);

    return authorStats || null;
  }
}
