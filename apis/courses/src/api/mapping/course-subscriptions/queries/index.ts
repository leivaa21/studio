import { DependencyContainer } from '@studio/dependency-injection';
import {
  CheckIfUserIsSubscribedToCourse,
  CheckIfUserIsSubscribedToCourseQuery,
} from '../../../../contexts/course-subscriptions/application/queries/CheckIfUserIsSubscribedToCourse';
import { QueryBus } from '../../../../contexts/shared/domain/QueryBus';
import {
  GetUserCourseSubscriptions,
  GetUserCourseSubscriptionsQuery,
} from '../../../../contexts/course-subscriptions/application/queries/GetUserCourseSubscriptions';
import {
  GetCourseSubscriptionByUserAndCourse,
  GetCourseSubscriptionByUserAndCourseQuery,
} from '../../../../contexts/course-subscriptions/application/queries/GetCourseSubscriptionByUserAndCourse';

const queryBus = DependencyContainer.get<QueryBus>(QueryBus);

queryBus.subscribe(
  CheckIfUserIsSubscribedToCourseQuery,
  CheckIfUserIsSubscribedToCourse
);
queryBus.subscribe(GetUserCourseSubscriptionsQuery, GetUserCourseSubscriptions);
queryBus.subscribe(
  GetCourseSubscriptionByUserAndCourseQuery,
  GetCourseSubscriptionByUserAndCourse
);
