import { DependencyContainer } from '@studio/dependency-injection';
import { EventBus } from '../../../../contexts/shared/domain/EventBus';
import { InMemoryAsyncEventBus } from '../../../../contexts/shared/infrastructure/EventBus/InMemoryAsyncEventBus';
import { DomainEventSubscriber } from '../../../../contexts/shared/domain/DomainEventSubscriber';
import { RemoveCourseSubscriptionsOnUnpublishedHandler } from '../../../../contexts/course-subscriptions/application/events/RemoveCourseSubscriptionsOnUnpublished';
import { CourseWasUnpublishedEvent } from '../../../../contexts/courses/domain/events/CourseWasUnpublished';

const eventBus = DependencyContainer.get<EventBus>(InMemoryAsyncEventBus);

const removeCourseSubscriptionsOnUnpublishedHandler = DependencyContainer.get<
  DomainEventSubscriber<CourseWasUnpublishedEvent>
>(RemoveCourseSubscriptionsOnUnpublishedHandler);

eventBus.addSubscribers([removeCourseSubscriptionsOnUnpublishedHandler]);
