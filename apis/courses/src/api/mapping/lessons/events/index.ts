import { DependencyContainer } from '@studio/dependency-injection';
import { EventBus } from '../../../../contexts/shared/domain/EventBus';
import { InMemoryAsyncEventBus } from '../../../../contexts/shared/infrastructure/EventBus/InMemoryAsyncEventBus';
import { DomainEventSubscriber } from '../../../../contexts/shared/domain/DomainEventSubscriber';
import {
  UpdateCourseWhenLessonsChangedHandler,
  UpdateCourseWhenLessonsChangedHandlerSubscribedEvents,
} from '../../../../contexts/lessons/application/events/UpdateCourseWhenLessonsChangedHandler';

const eventBus = DependencyContainer.get<EventBus>(InMemoryAsyncEventBus);

const updateCourseWhenLessonsChangedHandler = DependencyContainer.get<
  DomainEventSubscriber<UpdateCourseWhenLessonsChangedHandlerSubscribedEvents>
>(UpdateCourseWhenLessonsChangedHandler);

eventBus.addSubscribers([updateCourseWhenLessonsChangedHandler]);
