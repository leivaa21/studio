import { DependencyContainer } from '@studio/dependency-injection';

import { EventBus } from '../../../../contexts/shared/domain/EventBus';
import { DomainEventSubscriber } from '../../../../contexts/shared/domain/DomainEventSubscriber';

import { CourseSubscriptionWasCreatedEvent } from '../../../../contexts/course-subscriptions/domain/events/CourseSubscriptionWasCreated';
import { CourseSubscriptionWasDeletedEvent } from '../../../../contexts/course-subscriptions/domain/events/CourseSubscriptionWasDeleted';
import { DecreaseSubscribedCoursesCounterOnCourseSubscriptionDeletedHandler } from '../../../../contexts/consumer-stats/application/events/DecreaseSubscribedCoursesCounterOnCourseSubscriptionDeleted';
import { IncreaseSubscribedCoursesCounterOnCourseSubscriptionCreatedHandler } from '../../../../contexts/consumer-stats/application/events/IncreaseSubscribedCoursesCounterOnCourseSubscriptionCreated';
import { CourseSubscriptionWasCompletedEvent } from '../../../../contexts/course-subscriptions/domain/events/CourseSubscriptionWasCompleted';
import { IncreaseCompletedCoursesCounterOnCourseSubscriptionCompletedHandler } from '../../../../contexts/consumer-stats/application/events/IncreaseCompletedCoursesCounterOnCourseSubscriptionCompleted';
import { CourseSubscriptionWasUncompletedEvent } from '../../../../contexts/course-subscriptions/domain/events/CourseSubscriptionWasUncompleted';
import { DecreaseCompletedCoursesCounterOnCourseSubscriptionUncompletedHandler } from '../../../../contexts/consumer-stats/application/events/DecreaseCompletedCoursesCounterOnCourseSubscriptionUncompleted';

const eventBus = DependencyContainer.get<EventBus>(EventBus);

const increaseSubscribedCoursesCounterOnCourseSubscriptionCreated =
  DependencyContainer.get<
    DomainEventSubscriber<CourseSubscriptionWasCreatedEvent>
  >(IncreaseSubscribedCoursesCounterOnCourseSubscriptionCreatedHandler);

const decreaseSubscribedCoursesCounterOnCourseSubscriptionDeleted =
  DependencyContainer.get<
    DomainEventSubscriber<CourseSubscriptionWasDeletedEvent>
  >(DecreaseSubscribedCoursesCounterOnCourseSubscriptionDeletedHandler);

const increaseCompletedCoursesCounterOnCourseSubscriptionCompleted =
  DependencyContainer.get<
    DomainEventSubscriber<CourseSubscriptionWasCompletedEvent>
  >(IncreaseCompletedCoursesCounterOnCourseSubscriptionCompletedHandler);

const decreaseCompletedCoursesCounterOnCourseSubscriptionDeleted =
  DependencyContainer.get<
    DomainEventSubscriber<CourseSubscriptionWasUncompletedEvent>
  >(DecreaseCompletedCoursesCounterOnCourseSubscriptionUncompletedHandler);

eventBus.addSubscribers([
  increaseSubscribedCoursesCounterOnCourseSubscriptionCreated,
  decreaseSubscribedCoursesCounterOnCourseSubscriptionDeleted,
  increaseCompletedCoursesCounterOnCourseSubscriptionCompleted,
  decreaseCompletedCoursesCounterOnCourseSubscriptionDeleted,
]);
