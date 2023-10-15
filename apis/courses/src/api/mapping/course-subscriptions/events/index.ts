import { DependencyContainer } from '@studio/dependency-injection';
import { EventBus } from '../../../../contexts/shared/domain/EventBus';
import { DomainEventSubscriber } from '../../../../contexts/shared/domain/DomainEventSubscriber';
import { RemoveCourseSubscriptionsOnUnpublishedHandler } from '../../../../contexts/course-subscriptions/application/events/RemoveCourseSubscriptionsOnUnpublished';
import { CourseWasUnpublishedEvent } from '../../../../contexts/courses/domain/events/CourseWasUnpublished';
import { LessonWasCompletedOnCourseSubscriptionEvent } from '../../../../contexts/course-subscriptions/domain/events/LessonWasCompletedOnCourseSubscription';
import { CheckIfCourseWasCompletedOnLessonCompletedHandler } from '../../../../contexts/course-subscriptions/application/events/CheckIfCourseWasCompletedOnLessonCompleted';
import { LessonWasDeletedEvent } from '../../../../contexts/lessons/domain/events/LessonWasDeleted';
import { UpdateCourseSubscriptionsOnLessonWasDeletedHandler } from '../../../../contexts/course-subscriptions/application/events/UpdateCourseSubscriptionsOnLessonWasDeleted';
import { LessonContentWasUpdatedEvent } from '../../../../contexts/lessons/domain/events/LessonContentWasUpdated';
import { UpdateCourseSubscriptionOnLessonContentUpdatedHandler } from '../../../../contexts/course-subscriptions/application/events/UpdateCourseSubscriptionOnLessonContentUpdated';
import { LessonWasCreatedEvent } from '../../../../contexts/lessons/domain/events/LessonWasCreated';
import { MarkCourseSubscriptionAsNonCompletedOnLessonCreatedHandler } from '../../../../contexts/course-subscriptions/application/events/MarkCourseSubscriptionAsNonCompletedOnLessonCreated';

const eventBus = DependencyContainer.get<EventBus>(EventBus);

const markCourseSubscriptionAsNonCompletedOnLessonCreated =
  DependencyContainer.get<DomainEventSubscriber<LessonWasCreatedEvent>>(
    MarkCourseSubscriptionAsNonCompletedOnLessonCreatedHandler
  );

const removeCourseSubscriptionsOnUnpublishedHandler = DependencyContainer.get<
  DomainEventSubscriber<CourseWasUnpublishedEvent>
>(RemoveCourseSubscriptionsOnUnpublishedHandler);

const checkIfCourseWasCompletedOnLessonCompletedHandler =
  DependencyContainer.get<
    DomainEventSubscriber<LessonWasCompletedOnCourseSubscriptionEvent>
  >(CheckIfCourseWasCompletedOnLessonCompletedHandler);

const updateCourseSubscriptionsOnLessonWasDeletedHandler =
  DependencyContainer.get<DomainEventSubscriber<LessonWasDeletedEvent>>(
    UpdateCourseSubscriptionsOnLessonWasDeletedHandler
  );
const updateCourseSubscriptionOnLessonContentUpdatedHandler =
  DependencyContainer.get<DomainEventSubscriber<LessonContentWasUpdatedEvent>>(
    UpdateCourseSubscriptionOnLessonContentUpdatedHandler
  );

eventBus.addSubscribers([
  markCourseSubscriptionAsNonCompletedOnLessonCreated,
  removeCourseSubscriptionsOnUnpublishedHandler,
  checkIfCourseWasCompletedOnLessonCompletedHandler,
  updateCourseSubscriptionsOnLessonWasDeletedHandler,
  updateCourseSubscriptionOnLessonContentUpdatedHandler,
]);
