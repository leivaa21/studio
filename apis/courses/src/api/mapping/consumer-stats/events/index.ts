import { DependencyContainer } from '@studio/dependency-injection';
import { EventBus } from '../../../../contexts/shared/domain/EventBus';
import { InMemoryAsyncEventBus } from '../../../../contexts/shared/infrastructure/EventBus/InMemoryAsyncEventBus';
import { DomainEventSubscriber } from '../../../../contexts/shared/domain/DomainEventSubscriber';
import { CourseSubscriptionWasCreatedEvent } from '../../../../contexts/course-subscriptions/domain/events/CourseSubscriptionWasCreated';
import { CourseSubscriptionWasDeletedEvent } from '../../../../contexts/course-subscriptions/domain/events/CourseSubscriptionWasDeleted';
import { DecreaseSubscribedCoursesCounterOnCourseSubscriptionDeletedHandler } from '../../../../contexts/consumer-stats/application/events/DecreaseSubscribedCoursesCounterOnCourseSubscriptionDeleted';
import { IncreaseSubscribedCoursesCounterOnCourseSubscriptionCreatedHandler } from '../../../../contexts/consumer-stats/application/events/IncreaseSubscribedCoursesCounterOnCourseSubscriptionCreated';

const eventBus = DependencyContainer.get<EventBus>(InMemoryAsyncEventBus);

const increaseSubscribedCoursesCounterOnCourseSubscriptionCreated =
  DependencyContainer.get<
    DomainEventSubscriber<CourseSubscriptionWasCreatedEvent>
  >(IncreaseSubscribedCoursesCounterOnCourseSubscriptionCreatedHandler);

const decreaseSubscribedCoursesCounterOnCourseSubscriptionDeleted =
  DependencyContainer.get<
    DomainEventSubscriber<CourseSubscriptionWasDeletedEvent>
  >(DecreaseSubscribedCoursesCounterOnCourseSubscriptionDeletedHandler);

eventBus.addSubscribers([
  increaseSubscribedCoursesCounterOnCourseSubscriptionCreated,
  decreaseSubscribedCoursesCounterOnCourseSubscriptionDeleted,
]);
