import { DependencyContainer } from '@studio/dependency-injection';
import { EventBus } from '../../../../contexts/shared/domain/EventBus';
import { InMemoryAsyncEventBus } from '../../../../contexts/shared/infrastructure/EventBus/InMemoryAsyncEventBus';
import { DomainEventSubscriber } from '../../../../contexts/shared/domain/DomainEventSubscriber';
import {
  UpdateCourseOnLessonsUpdatedHandler,
  UpdateCourseOnLessonsUpdatedHandlerSubscribedEvents,
} from '../../../../contexts/courses/application/events/UpdateCourseOnLessonsUpdated';

const eventBus = DependencyContainer.get<EventBus>(InMemoryAsyncEventBus);

const updateCourseOnLessonsUpdatedHandler = DependencyContainer.get<
  DomainEventSubscriber<UpdateCourseOnLessonsUpdatedHandlerSubscribedEvents>
>(UpdateCourseOnLessonsUpdatedHandler);

eventBus.addSubscribers([updateCourseOnLessonsUpdatedHandler]);
