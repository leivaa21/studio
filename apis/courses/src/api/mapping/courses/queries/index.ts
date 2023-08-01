import { DependencyContainer } from '@studio/dependency-injection';
import { QueryBus } from '../../../../contexts/shared/domain/QueryBus';
import { InMemoryQueryBus } from '../../../../contexts/shared/infrastructure/QueryBus/InMemoryQueryBus';
import {
  GetMyCoursesPaginated,
  GetMyCoursesPaginatedQuery,
} from '../../../../contexts/courses/application/queries/GetMyCoursesPaginated';
import {
  GetCourseById,
  GetCourseByIdQuery,
} from '../../../../contexts/courses/application/queries/GetCourseById';
import {
  GetPublishedCoursesPaginated,
  GetPublishedCoursesPaginatedQuery,
} from '../../../../contexts/courses/application/queries/GetPublishedCoursesPaginated';

const queryBus = DependencyContainer.get<QueryBus>(InMemoryQueryBus);

queryBus.subscribe(GetMyCoursesPaginatedQuery, GetMyCoursesPaginated);
queryBus.subscribe(GetCourseByIdQuery, GetCourseById);
queryBus.subscribe(
  GetPublishedCoursesPaginatedQuery,
  GetPublishedCoursesPaginated
);
