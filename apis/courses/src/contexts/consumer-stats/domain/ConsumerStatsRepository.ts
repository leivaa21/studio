import { UserId } from '../../course-subscriptions/domain/UserId';
import { Nullable } from '../../shared/domain/Nullable';
import { ConsumerStats } from './ConsumerStats';

export abstract class ConsumerStatsRepository {
  abstract create(consumerStats: ConsumerStats): Promise<void>;
  abstract find(userId: UserId): Promise<Nullable<ConsumerStats>>;
  abstract update(consumerStats: ConsumerStats): Promise<void>;
  abstract delete(userId: UserId): Promise<void>;
}
