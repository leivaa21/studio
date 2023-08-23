import { ConsumerStats } from '../../../../src/contexts/consumer-stats/domain/ConsumerStats';
import { ConsumerStatsModel } from '../../../../src/contexts/consumer-stats/infrastructure/persistance/mongo/ConsumerStatsSchema';
import { ConsumerStatsSchemaFactory } from '../../../../src/contexts/consumer-stats/infrastructure/persistance/mongo/ConsumerStatsSchemaFactory';
import { UserId } from '../../../../src/contexts/course-subscriptions/domain/UserId';

const schemaFactory = new ConsumerStatsSchemaFactory();

export async function createConsumerStats(
  consumerStats: ConsumerStats
): Promise<void> {
  const document = schemaFactory.createSchemaFromEntity(consumerStats);
  await ConsumerStatsModel.create(document);
}

export async function findConsumerStats(
  userId: UserId
): Promise<ConsumerStats | undefined> {
  const document = await ConsumerStatsModel.findOne({
    userId: userId.value,
  });

  return document ? schemaFactory.createEntityFromSchema(document) : undefined;
}
