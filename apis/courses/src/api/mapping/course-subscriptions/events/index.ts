import { DependencyContainer } from '@studio/dependency-injection';
import { EventBus } from '../../../../contexts/shared/domain/EventBus';
import { InMemoryAsyncEventBus } from '../../../../contexts/shared/infrastructure/EventBus/InMemoryAsyncEventBus';
import { DomainEventSubscriber } from '../../../../contexts/shared/domain/DomainEventSubscriber';
import { RemoveCourseSubscriptionsOnUnpublishedHandler } from '../../../../contexts/course-subscriptions/application/events/RemoveCourseSubscriptionsOnUnpublished';
import { CourseWasUnpublishedEvent } from '../../../../contexts/courses/domain/events/CourseWasUnpublished';
import { LessonWasCompletedOnCourseSubscriptionEvent } from '../../../../contexts/course-subscriptions/domain/events/LessonWasCompletedOnCourseSubscription';
import { CheckIfCourseWasCompletedOnLessonCompletedHandler } from '../../../../contexts/course-subscriptions/application/events/CheckIfCourseWasCompletedOnLessonCompleted';

const eventBus = DependencyContainer.get<EventBus>(InMemoryAsyncEventBus);

const removeCourseSubscriptionsOnUnpublishedHandler = DependencyContainer.get<
  DomainEventSubscriber<CourseWasUnpublishedEvent>
>(RemoveCourseSubscriptionsOnUnpublishedHandler);
const checkIfCourseWasCompletedOnLessonCompletedHandler =
  DependencyContainer.get<
    DomainEventSubscriber<LessonWasCompletedOnCourseSubscriptionEvent>
  >(CheckIfCourseWasCompletedOnLessonCompletedHandler);

eventBus.addSubscribers([
  removeCourseSubscriptionsOnUnpublishedHandler,
  checkIfCourseWasCompletedOnLessonCompletedHandler,
]);
