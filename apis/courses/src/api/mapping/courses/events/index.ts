import { DependencyContainer } from '@studio/dependency-injection';

import { EventBus } from '../../../../contexts/shared/domain/EventBus';
import { RabbitMQEventBus } from '../../../../contexts/shared/infrastructure/EventBus/RabbitMQEventBus';
import { DomainEventSubscriber } from '../../../../contexts/shared/domain/DomainEventSubscriber';

import {
  UpdateCourseOnLessonsUpdatedHandler,
  UpdateCourseOnLessonsUpdatedHandlerSubscribedEvents,
} from '../../../../contexts/courses/application/events/UpdateCourseOnLessonsUpdated';

const eventBus = DependencyContainer.get<EventBus>(RabbitMQEventBus);

const updateCourseOnLessonsUpdatedHandler = DependencyContainer.get<
  DomainEventSubscriber<UpdateCourseOnLessonsUpdatedHandlerSubscribedEvents>
>(UpdateCourseOnLessonsUpdatedHandler);

eventBus.addSubscribers([updateCourseOnLessonsUpdatedHandler]);
