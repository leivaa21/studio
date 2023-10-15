import { MongoRepository } from '../../../../shared/infrastructure/mongo/MongoRepository';
import { ConsumerStatsSchemaFactory } from './ConsumerStatsSchemaFactory';
import { ConsumerStatsData } from './ConsumerStatsData';
import { ConsumerStatsModel } from './ConsumerStatsSchema';
import { Nullable } from '../../../../shared/domain/Nullable';
import { ConsumerStats } from '../../../domain/ConsumerStats';
import { ConsumerStatsRepository } from '../../../domain/ConsumerStatsRepository';
import { UserId } from '../../../../course-subscriptions/domain/UserId';

export class MongoConsumerStatsRepository
  extends MongoRepository<ConsumerStatsData, ConsumerStats>
  implements ConsumerStatsRepository
{
  constructor(consumerStatsSchemaFactory: ConsumerStatsSchemaFactory) {
    super(consumerStatsSchemaFactory);
  }

  protected model() {
    return ConsumerStatsModel;
  }

  public async create(consumerStats: ConsumerStats): Promise<void> {
    await this.model().create(
      this.entitySchemaFactory.createSchemaFromEntity(consumerStats)
    );
  }

  public async find(userId: UserId): Promise<Nullable<ConsumerStats>> {
    const document = await this.model().findOne({ userId: userId.value });

    return document
      ? this.entitySchemaFactory.createEntityFromSchema(document)
      : null;
  }

  public async update(consumerStats: ConsumerStats): Promise<void> {
    await this.model().findOneAndUpdate(
      { userId: consumerStats.userId.value },
      this.entitySchemaFactory.createSchemaFromEntity(consumerStats)
    );
  }

  public async delete(userId: UserId): Promise<void> {
    await this.model().findOneAndDelete({ userId: userId.value });
  }
}
