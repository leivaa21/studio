import { DependencyContainer } from '@studio/dependency-injection';
import { QueryBus } from '../../../../contexts/shared/domain/QueryBus';
import {
  GetCourseStats,
  GetCourseStatsQuery,
} from '../../../../contexts/course-stats/application/queries/GetCourseStats';

const queryBus = DependencyContainer.get<QueryBus>(QueryBus);

queryBus.subscribe(GetCourseStatsQuery, GetCourseStats);
