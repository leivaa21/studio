import { DependencyContainer } from '@studio/dependency-injection';
import { DomainEventSubscriber } from '@studio/events';

import { EventBus } from '../../../../contexts/shared/domain/EventBus';
import { ReorderLessonsOnLessonDeletedHandler } from '../../../../contexts/lessons/application/events/ReorderLessonsOnLessonDeleted';
import { LessonWasDeletedEvent } from '../../../../contexts/lessons/domain/events/LessonWasDeleted';

const eventBus = DependencyContainer.get<EventBus>(EventBus);

const reorderLessonsOnLessonDeletedHandler = DependencyContainer.get<
  DomainEventSubscriber<LessonWasDeletedEvent>
>(ReorderLessonsOnLessonDeletedHandler);

eventBus.addSubscribers([reorderLessonsOnLessonDeletedHandler]);
