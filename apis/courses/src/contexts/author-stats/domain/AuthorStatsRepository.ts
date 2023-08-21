import { AuthorId } from '../../courses/domain/AuthorId';
import { Nullable } from '../../shared/domain/Nullable';
import { AuthorStats } from './AuthorStats';

export interface AuthorStatsRepository {
  create(authorStats: AuthorStats): Promise<void>;
  find(authorId: AuthorId): Promise<Nullable<AuthorStats>>;
  update(authorStats: AuthorStats): Promise<void>;
  delete(authorId: AuthorId): Promise<void>;
}
