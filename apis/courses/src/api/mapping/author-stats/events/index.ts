import { DependencyContainer } from '@studio/dependency-injection';
import { EventBus } from '../../../../contexts/shared/domain/EventBus';
import { InMemoryAsyncEventBus } from '../../../../contexts/shared/infrastructure/EventBus/InMemoryAsyncEventBus';
import { DomainEventSubscriber } from '../../../../contexts/shared/domain/DomainEventSubscriber';
import { CourseWasCreatedEvent } from '../../../../contexts/courses/domain/events/CourseWasCreated';
import { IncreaseCourseCounterOnCourseCreatedHandler } from '../../../../contexts/author-stats/application/events/IncreaseCourseCounterOnCourseCreated';

const eventBus = DependencyContainer.get<EventBus>(InMemoryAsyncEventBus);

const increaseCourseCounterOnCourseCreated = DependencyContainer.get<
  DomainEventSubscriber<CourseWasCreatedEvent>
>(IncreaseCourseCounterOnCourseCreatedHandler);

eventBus.addSubscribers([increaseCourseCounterOnCourseCreated]);
