import { AuthorId } from '../../courses/domain/AuthorId';
import { Nullable } from '../../shared/domain/Nullable';
import { AuthorStats } from './AuthorStats';

export abstract class AuthorStatsRepository {
  abstract create(authorStats: AuthorStats): Promise<void>;
  abstract find(authorId: AuthorId): Promise<Nullable<AuthorStats>>;
  abstract update(authorStats: AuthorStats): Promise<void>;
  abstract delete(authorId: AuthorId): Promise<void>;
}
