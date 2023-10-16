import { DependencyContainer } from '@studio/dependency-injection';
import { DomainEventSubscriber } from '@studio/events';

import { EventBus } from '../../../../contexts/shared/domain/EventBus';
import {
  UpdateCourseOnLessonsUpdatedHandler,
  UpdateCourseOnLessonsUpdatedHandlerSubscribedEvents,
} from '../../../../contexts/courses/application/events/UpdateCourseOnLessonsUpdated';

const eventBus = DependencyContainer.get<EventBus>(EventBus);

const updateCourseOnLessonsUpdatedHandler = DependencyContainer.get<
  DomainEventSubscriber<UpdateCourseOnLessonsUpdatedHandlerSubscribedEvents>
>(UpdateCourseOnLessonsUpdatedHandler);

eventBus.addSubscribers([updateCourseOnLessonsUpdatedHandler]);
