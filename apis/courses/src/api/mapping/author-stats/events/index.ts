import { DependencyContainer } from '@studio/dependency-injection';
import { EventBus } from '../../../../contexts/shared/domain/EventBus';
import { InMemoryAsyncEventBus } from '../../../../contexts/shared/infrastructure/EventBus/InMemoryAsyncEventBus';
import { DomainEventSubscriber } from '../../../../contexts/shared/domain/DomainEventSubscriber';
import { CourseWasCreatedEvent } from '../../../../contexts/courses/domain/events/CourseWasCreated';
import { IncreaseCourseCounterOnCourseCreatedHandler } from '../../../../contexts/author-stats/application/events/IncreaseCourseCounterOnCourseCreated';
import { LessonWasCreatedEvent } from '../../../../contexts/lessons/domain/events/LessonWasCreated';
import { IncreaseLessonCounterOnLessonCreatedHandler } from '../../../../contexts/author-stats/application/events/IncreaseLessonCounterOnLessonCreated';
import { LessonWasDeletedEvent } from '../../../../contexts/lessons/domain/events/LessonWasDeleted';
import { DecreaseLessonCounterOnLessonDeletedHandler } from '../../../../contexts/author-stats/application/events/DecreaseLessonCounterOnLessonDeleted';
import { CourseWasPublishedEvent } from '../../../../contexts/courses/domain/events/CourseWasPublished';
import { IncreaseCoursePublishedCounterOnCoursePublishedHandler } from '../../../../contexts/author-stats/application/events/IncreaseCoursePublishedCounterOnCoursePublished';

const eventBus = DependencyContainer.get<EventBus>(InMemoryAsyncEventBus);

const increaseCourseCounterOnCourseCreated = DependencyContainer.get<
  DomainEventSubscriber<CourseWasCreatedEvent>
>(IncreaseCourseCounterOnCourseCreatedHandler);

const increaseLessonsCounterOnLessonCreated = DependencyContainer.get<
  DomainEventSubscriber<LessonWasCreatedEvent>
>(IncreaseLessonCounterOnLessonCreatedHandler);

const decreaseLessonsCounterOnLessonDeleted = DependencyContainer.get<
  DomainEventSubscriber<LessonWasDeletedEvent>
>(DecreaseLessonCounterOnLessonDeletedHandler);

const increaseCoursePublishedCounterOnCoursePublished = DependencyContainer.get<
  DomainEventSubscriber<CourseWasPublishedEvent>
>(IncreaseCoursePublishedCounterOnCoursePublishedHandler);

eventBus.addSubscribers([
  increaseCourseCounterOnCourseCreated,
  increaseLessonsCounterOnLessonCreated,
  decreaseLessonsCounterOnLessonDeleted,
  increaseCoursePublishedCounterOnCoursePublished,
]);
