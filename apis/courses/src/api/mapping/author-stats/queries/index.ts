import { DependencyContainer } from '@studio/dependency-injection';
import { QueryBus } from '../../../../contexts/shared/domain/QueryBus';
import {
  GetAuthorStats,
  GetAuthorStatsQuery,
} from '../../../../contexts/author-stats/application/queries/GetAuthorStats';

const queryBus = DependencyContainer.get<QueryBus>(QueryBus);

queryBus.subscribe(GetAuthorStatsQuery, GetAuthorStats);
