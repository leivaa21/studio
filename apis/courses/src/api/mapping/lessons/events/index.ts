import { DependencyContainer } from '@studio/dependency-injection';

import { EventBus } from '../../../../contexts/shared/domain/EventBus';
import { RabbitMQEventBus } from '../../../../contexts/shared/infrastructure/EventBus/RabbitMQEventBus';
import { DomainEventSubscriber } from '../../../../contexts/shared/domain/DomainEventSubscriber';

import { ReorderLessonsOnLessonDeletedHandler } from '../../../../contexts/lessons/application/events/ReorderLessonsOnLessonDeleted';
import { LessonWasDeletedEvent } from '../../../../contexts/lessons/domain/events/LessonWasDeleted';

const eventBus = DependencyContainer.get<EventBus>(RabbitMQEventBus);

const reorderLessonsOnLessonDeletedHandler = DependencyContainer.get<
  DomainEventSubscriber<LessonWasDeletedEvent>
>(ReorderLessonsOnLessonDeletedHandler);

eventBus.addSubscribers([reorderLessonsOnLessonDeletedHandler]);
