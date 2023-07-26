import { DependencyContainer } from '@studio/dependency-injection';
import { QueryBus } from '../../../../contexts/shared/domain/QueryBus';
import { InMemoryQueryBus } from '../../../../contexts/shared/infrastructure/QueryBus/InMemoryQueryBus';
import {
  GetLessonsByCourse,
  GetLessonsByCourseQuery,
} from '../../../../contexts/lessons/application/queries/GetLessonsByCourse';
import {
  GetLessonById,
  GetLessonByIdQuery,
} from '../../../../contexts/lessons/application/queries/GetLessonById';

const queryBus = DependencyContainer.get<QueryBus>(InMemoryQueryBus);

queryBus.subscribe(GetLessonsByCourseQuery, GetLessonsByCourse);
queryBus.subscribe(GetLessonByIdQuery, GetLessonById);
