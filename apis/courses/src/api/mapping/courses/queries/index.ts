import { DependencyContainer } from '@studio/dependency-injection';
import { QueryBus } from '../../../../contexts/shared/domain/QueryBus';
import { InMemoryQueryBus } from '../../../../contexts/shared/infrastructure/QueryBus/InMemoryQueryBus';
import {
  GetMyCoursesPaginated,
  GetMyCoursesPaginatedQuery,
} from '../../../../contexts/courses/application/queries/GetMyCoursesPaginated';

const queryBus = DependencyContainer.get<QueryBus>(InMemoryQueryBus);

queryBus.subscribe(GetMyCoursesPaginatedQuery, GetMyCoursesPaginated);