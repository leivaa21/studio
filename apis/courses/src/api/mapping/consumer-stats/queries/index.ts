import { DependencyContainer } from '@studio/dependency-injection';
import { QueryBus } from '../../../../contexts/shared/domain/QueryBus';
import {
  GetConsumerStats,
  GetConsumerStatsQuery,
} from '../../../../contexts/consumer-stats/application/queries/GetConsumerStats';

const queryBus = DependencyContainer.get<QueryBus>(QueryBus);

queryBus.subscribe(GetConsumerStatsQuery, GetConsumerStats);
