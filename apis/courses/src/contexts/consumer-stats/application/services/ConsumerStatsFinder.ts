import { UserId } from '../../../course-subscriptions/domain/UserId';
import { Nullable } from '../../../shared/domain/Nullable';
import { ConsumerStats } from '../../domain/ConsumerStats';
import { ConsumerStatsRepository } from '../../domain/ConsumerStatsRepository';
import { ConsumerStatsNotFoundError } from '../../domain/errors/ConsumerStatsNotFoundError';

export class ConsumerStatsFinder {
  constructor(
    private readonly consumerStatsRepository: ConsumerStatsRepository
  ) {}

  public async findOrThrow(userId: UserId): Promise<ConsumerStats> {
    const consumerStats = await this.consumerStatsRepository.find(userId);

    if (!consumerStats) {
      throw ConsumerStatsNotFoundError.searchedByUser(userId.value);
    }

    return consumerStats;
  }

  public async find(userId: UserId): Promise<Nullable<ConsumerStats>> {
    const consumerStats = await this.consumerStatsRepository.find(userId);

    return consumerStats || null;
  }
}
