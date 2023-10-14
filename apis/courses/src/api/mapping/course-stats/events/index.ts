import { DependencyContainer } from '@studio/dependency-injection';

import { EventBus } from '../../../../contexts/shared/domain/EventBus';
import { RabbitMQEventBus } from '../../../../contexts/shared/infrastructure/EventBus/RabbitMQEventBus';
import { DomainEventSubscriber } from '../../../../contexts/shared/domain/DomainEventSubscriber';

import { CourseSubscriptionWasCreatedEvent } from '../../../../contexts/course-subscriptions/domain/events/CourseSubscriptionWasCreated';
import { CourseSubscriptionWasDeletedEvent } from '../../../../contexts/course-subscriptions/domain/events/CourseSubscriptionWasDeleted';
import { CourseSubscriptionWasCompletedEvent } from '../../../../contexts/course-subscriptions/domain/events/CourseSubscriptionWasCompleted';
import { CourseSubscriptionWasUncompletedEvent } from '../../../../contexts/course-subscriptions/domain/events/CourseSubscriptionWasUncompleted';
import { IncreaseSubscriptionsCounterOnCourseSubscriptionCreatedHandler } from '../../../../contexts/course-stats/application/events/IncreaseSubscriptionsCounterOnCourseSubscriptionCreated';
import { DecreaseSubscriptionsCounterOnCourseSubscriptionDeletedHandler } from '../../../../contexts/course-stats/application/events/DecreaseSubscriptionsCounterOnCourseSubscriptionDeleted';
import { IncreaseTimesCompletedCounterOnCourseSubscriptionCompletedHandler } from '../../../../contexts/course-stats/application/events/IncreaseTimesCompletedCounterOnCourseSubscriptionCompleted';
import { DecreaseTimesCompletedCounterOnCourseSubscriptionUncompletedHandler } from '../../../../contexts/course-stats/application/events/DecreaseTimesCompletedCounterOnCourseSubscriptionUncompleted';
import { CourseWasCreatedEvent } from '../../../../contexts/courses/domain/events/CourseWasCreated';
import { CreateCourseStatsOnCourseCreatedHandler } from '../../../../contexts/course-stats/application/events/CreateCourseStatsOnCourseCreated';

const eventBus = DependencyContainer.get<EventBus>(RabbitMQEventBus);

const createCourseStatsOnCourseCreated = DependencyContainer.get<
  DomainEventSubscriber<CourseWasCreatedEvent>
>(CreateCourseStatsOnCourseCreatedHandler);

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
  createCourseStatsOnCourseCreated,
  increaseSubscriptionsCounterOnCourseSubscriptionCreated,
  decreaseSubscriptionsCounterOnCourseSubscriptionDeleted,
  increaseTimesCompletedCounterOnCourseSubscriptionCompleted,
  decreaseTimesCompletedCounterOnCourseSubscriptionUncompleted,
]);
