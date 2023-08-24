import { DependencyContainer } from '@studio/dependency-injection';
import { QueryBus } from '../../../../contexts/shared/domain/QueryBus';
import { InMemoryQueryBus } from '../../../../contexts/shared/infrastructure/QueryBus/InMemoryQueryBus';
import {
  GetAuthorStats,
  GetAuthorStatsQuery,
} from '../../../../contexts/author-stats/application/queries/GetAuthorStats';

const queryBus = DependencyContainer.get<QueryBus>(InMemoryQueryBus);

queryBus.subscribe(GetAuthorStatsQuery, GetAuthorStats);
