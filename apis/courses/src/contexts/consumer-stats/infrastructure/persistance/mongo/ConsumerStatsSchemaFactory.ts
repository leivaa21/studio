import { Injectable } from '@studio/dependency-injection';
import { EntitySchemaFactory } from '../../../../shared/infrastructure/mongo/EntitySchemaFactory';
import { ConsumerStatsData } from './ConsumerStatsData';
import { ConsumerStats } from '../../../domain/ConsumerStats';

@Injectable()
export class ConsumerStatsSchemaFactory
  implements EntitySchemaFactory<ConsumerStatsData, ConsumerStats>
{
  createSchemaFromEntity(consumerStats: ConsumerStats): ConsumerStatsData {
    return consumerStats.toPrimitives();
  }
  createEntityFromSchema(schema: ConsumerStatsData): ConsumerStats {
    return ConsumerStats.fromPrimitives(schema);
  }
}
