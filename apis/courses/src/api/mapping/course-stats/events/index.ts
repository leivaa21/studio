import { DependencyContainer } from '@studio/dependency-injection';
import { EventBus } from '../../../../contexts/shared/domain/EventBus';
import { InMemoryAsyncEventBus } from '../../../../contexts/shared/infrastructure/EventBus/InMemoryAsyncEventBus';
import { DomainEventSubscriber } from '../../../../contexts/shared/domain/DomainEventSubscriber';
import { CourseSubscriptionWasCreatedEvent } from '../../../../contexts/course-subscriptions/domain/events/CourseSubscriptionWasCreated';
import { CourseSubscriptionWasDeletedEvent } from '../../../../contexts/course-subscriptions/domain/events/CourseSubscriptionWasDeleted';
import { CourseSubscriptionWasCompletedEvent } from '../../../../contexts/course-subscriptions/domain/events/CourseSubscriptionWasCompleted';
import { CourseSubscriptionWasUncompletedEvent } from '../../../../contexts/course-subscriptions/domain/events/CourseSubscriptionWasUncompleted';
import { IncreaseSubscriptionsCounterOnCourseSubscriptionCreatedHandler } from '../../../../contexts/course-stats/application/events/IncreaseSubscriptionsCounterOnCourseSubscriptionCreated';
import { DecreaseSubscriptionsCounterOnCourseSubscriptionDeletedHandler } from '../../../../contexts/course-stats/application/events/DecreaseSubscriptionsCounterOnCourseSubscriptionDeleted';
import { IncreaseTimesCompletedCounterOnCourseSubscriptionCompletedHandler } from '../../../../contexts/course-stats/application/events/IncreaseTimesCompletedCounterOnCourseSubscriptionCompleted';
import { DecreaseTimesCompletedCounterOnCourseSubscriptionUncompletedHandler } from '../../../../contexts/course-stats/application/events/DecreaseTimesCompletedCounterOnCourseSubscriptionUncompleted';

const eventBus = DependencyContainer.get<EventBus>(InMemoryAsyncEventBus);

const increaseSubscriptionsCounterOnCourseSubscriptionCreated =
  DependencyContainer.get<
    DomainEventSubscriber<CourseSubscriptionWasCreatedEvent>
  >(IncreaseSubscriptionsCounterOnCourseSubscriptionCreatedHandler);

const decreaseSubscriptionsCounterOnCourseSubscriptionDeleted =
  DependencyContainer.get<
    DomainEventSubscriber<CourseSubscriptionWasDeletedEvent>
  >(DecreaseSubscriptionsCounterOnCourseSubscriptionDeletedHandler);

const increaseTimesCompletedCounterOnCourseSubscriptionCompleted =
  DependencyContainer.get<
    DomainEventSubscriber<CourseSubscriptionWasCompletedEvent>
  >(IncreaseTimesCompletedCounterOnCourseSubscriptionCompletedHandler);

const decreaseTimesCompletedCounterOnCourseSubscriptionUncompleted =
  DependencyContainer.get<
    DomainEventSubscriber<CourseSubscriptionWasUncompletedEvent>
  >(DecreaseTimesCompletedCounterOnCourseSubscriptionUncompletedHandler);

eventBus.addSubscribers([
  increaseSubscriptionsCounterOnCourseSubscriptionCreated,
  decreaseSubscriptionsCounterOnCourseSubscriptionDeleted,
  increaseTimesCompletedCounterOnCourseSubscriptionCompleted,
  decreaseTimesCompletedCounterOnCourseSubscriptionUncompleted,
]);
