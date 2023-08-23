import { UserId } from '../../course-subscriptions/domain/UserId';
import { Nullable } from '../../shared/domain/Nullable';
import { ConsumerStats } from './ConsumerStats';

export interface ConsumerStatsRepository {
  create(consumerStats: ConsumerStats): Promise<void>;
  find(userId: UserId): Promise<Nullable<ConsumerStats>>;
  update(consumerStats: ConsumerStats): Promise<void>;
  delete(userId: UserId): Promise<void>;
}
