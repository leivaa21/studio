import { Injectable } from '@studio/dependency-injection';
import { QueryHandler } from '../../../shared/application/QueryHandler';
import { ConsumerStats } from '../../domain/ConsumerStats';
import { ConsumerStatsFinder } from '../services/ConsumerStatsFinder';
import { ConsumerStatsRepository } from '../../domain/ConsumerStatsRepository';
import { MongoConsumerStatsRepository } from '../../infrastructure/persistance/mongo/MongoConsumerStatsRepository';
import { UserId } from '../../../course-subscriptions/domain/UserId';

export class GetConsumerStatsQuery {
  public readonly userId: string;

  public constructor(params: { userId: string }) {
    this.userId = params.userId;
  }
}

@Injectable({
  dependencies: [MongoConsumerStatsRepository],
})
export class GetConsumerStats
  implements QueryHandler<GetConsumerStatsQuery, ConsumerStats>
{
  private readonly consumerStatsFinder: ConsumerStatsFinder;

  public constructor(consumerStatsRepository: ConsumerStatsRepository) {
    this.consumerStatsFinder = new ConsumerStatsFinder(consumerStatsRepository);
  }
  public async execute(query: GetConsumerStatsQuery): Promise<ConsumerStats> {
    const userId = UserId.of(query.userId);

    const consumerStats = await this.consumerStatsFinder.findOrThrow(userId);

    return consumerStats;
  }
}
