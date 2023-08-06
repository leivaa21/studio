import { DependencyContainer } from '@studio/dependency-injection';
import {
  CheckIfUserIsSubscribedToCourse,
  CheckIfUserIsSubscribedToCourseQuery,
} from '../../../../contexts/course-subscriptions/application/queries/CheckIfUserIsSubscribedToCourse';
import { QueryBus } from '../../../../contexts/shared/domain/QueryBus';
import { InMemoryQueryBus } from '../../../../contexts/shared/infrastructure/QueryBus/InMemoryQueryBus';

const queryBus = DependencyContainer.get<QueryBus>(InMemoryQueryBus);

queryBus.subscribe(
  CheckIfUserIsSubscribedToCourseQuery,
  CheckIfUserIsSubscribedToCourse
);
