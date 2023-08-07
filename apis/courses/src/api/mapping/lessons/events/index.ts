import { DependencyContainer } from '@studio/dependency-injection';
import { EventBus } from '../../../../contexts/shared/domain/EventBus';
import { InMemoryAsyncEventBus } from '../../../../contexts/shared/infrastructure/EventBus/InMemoryAsyncEventBus';
import { DomainEventSubscriber } from '../../../../contexts/shared/domain/DomainEventSubscriber';
import { ReorderLessonsOnLessonDeletedHandler } from '../../../../contexts/lessons/application/events/ReorderLessonsOnLessonDeleted';
import { LessonWasDeletedEvent } from '../../../../contexts/lessons/domain/events/LessonWasDeleted';

const eventBus = DependencyContainer.get<EventBus>(InMemoryAsyncEventBus);

const reorderLessonsOnLessonDeletedHandler = DependencyContainer.get<
  DomainEventSubscriber<LessonWasDeletedEvent>
>(ReorderLessonsOnLessonDeletedHandler);

eventBus.addSubscribers([reorderLessonsOnLessonDeletedHandler]);
