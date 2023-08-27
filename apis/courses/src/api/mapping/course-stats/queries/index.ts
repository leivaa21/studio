import { DependencyContainer } from '@studio/dependency-injection';
import { QueryBus } from '../../../../contexts/shared/domain/QueryBus';
import { InMemoryQueryBus } from '../../../../contexts/shared/infrastructure/QueryBus/InMemoryQueryBus';
import {
  GetCourseStats,
  GetCourseStatsQuery,
} from '../../../../contexts/course-stats/application/queries/GetCourseStats';

const queryBus = DependencyContainer.get<QueryBus>(InMemoryQueryBus);

queryBus.subscribe(GetCourseStatsQuery, GetCourseStats);
