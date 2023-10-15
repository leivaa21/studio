import { DependencyContainer } from '@studio/dependency-injection';
import { QueryBus } from '../../../../contexts/shared/domain/QueryBus';
import {
  GetMyCoursesFiltered,
  GetMyCoursesFilteredQuery,
} from '../../../../contexts/courses/application/queries/GetMyCoursesFiltered';
import {
  GetCourseById,
  GetCourseByIdQuery,
} from '../../../../contexts/courses/application/queries/GetCourseById';
import {
  GetPublishedCoursesFiltered,
  GetPublishedCoursesFilteredQuery,
} from '../../../../contexts/courses/application/queries/GetPublishedCoursesFiltered';
import {
  GetMySubscribedCourses,
  GetMySubscribedCoursesQuery,
} from '../../../../contexts/courses/application/queries/GetMySubscribedCourses';

const queryBus = DependencyContainer.get<QueryBus>(QueryBus);

queryBus.subscribe(GetMyCoursesFilteredQuery, GetMyCoursesFiltered);
queryBus.subscribe(GetCourseByIdQuery, GetCourseById);
queryBus.subscribe(
  GetPublishedCoursesFilteredQuery,
  GetPublishedCoursesFiltered
);
queryBus.subscribe(GetMySubscribedCoursesQuery, GetMySubscribedCourses);
