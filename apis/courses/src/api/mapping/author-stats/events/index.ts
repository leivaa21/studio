import { DependencyContainer } from '@studio/dependency-injection';
import { DomainEventSubscriber } from '@studio/events';

import { EventBus } from '../../../../contexts/shared/domain/EventBus';
import { CourseWasCreatedEvent } from '../../../../contexts/courses/domain/events/CourseWasCreated';
import { IncreaseCourseCounterOnCourseCreatedHandler } from '../../../../contexts/author-stats/application/events/IncreaseCourseCounterOnCourseCreated';
import { LessonWasCreatedEvent } from '../../../../contexts/lessons/domain/events/LessonWasCreated';
import { IncreaseLessonCounterOnLessonCreatedHandler } from '../../../../contexts/author-stats/application/events/IncreaseLessonCounterOnLessonCreated';
import { LessonWasDeletedEvent } from '../../../../contexts/lessons/domain/events/LessonWasDeleted';
import { DecreaseLessonCounterOnLessonDeletedHandler } from '../../../../contexts/author-stats/application/events/DecreaseLessonCounterOnLessonDeleted';
import { CourseWasPublishedEvent } from '../../../../contexts/courses/domain/events/CourseWasPublished';
import { IncreaseCoursePublishedCounterOnCoursePublishedHandler } from '../../../../contexts/author-stats/application/events/IncreaseCoursePublishedCounterOnCoursePublished';
import { CourseWasUnpublishedEvent } from '../../../../contexts/courses/domain/events/CourseWasUnpublished';
import { DecreaseCoursePublishedCounterOnCourseUnpublishedHandler } from '../../../../contexts/author-stats/application/events/DecreaseCoursePublishedCounterOnCourseUnpublished';
import { CourseSubscriptionWasCreatedEvent } from '../../../../contexts/course-subscriptions/domain/events/CourseSubscriptionWasCreated';
import { IncreaseCourseSubscriptionsCounterOnCourseSubscriptionCreatedHandler } from '../../../../contexts/author-stats/application/events/IncreaseCourseSubscriptionsCounterOnCourseSubscriptionCreated';
import { CourseSubscriptionWasDeletedEvent } from '../../../../contexts/course-subscriptions/domain/events/CourseSubscriptionWasDeleted';
import { DecreaseCourseSubscriptionsCounterOnCourseSubscriptionDeletedHandler } from '../../../../contexts/author-stats/application/events/DecreaseCourseSubscriptionsCounterOnCourseSubscriptionDeleted';

const eventBus = DependencyContainer.get<EventBus>(EventBus);

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

const decreaseCoursePublishedCounterOnCourseUnpublished =
  DependencyContainer.get<DomainEventSubscriber<CourseWasUnpublishedEvent>>(
    DecreaseCoursePublishedCounterOnCourseUnpublishedHandler
  );

const increaseCourseSubscriptionsCounterOnCourseSubscriptionCreated =
  DependencyContainer.get<
    DomainEventSubscriber<CourseSubscriptionWasCreatedEvent>
  >(IncreaseCourseSubscriptionsCounterOnCourseSubscriptionCreatedHandler);

const decreaseCourseSubscriptionsCounterOnCourseSubscriptionDeleted =
  DependencyContainer.get<
    DomainEventSubscriber<CourseSubscriptionWasDeletedEvent>
  >(DecreaseCourseSubscriptionsCounterOnCourseSubscriptionDeletedHandler);

eventBus.addSubscribers([
  increaseCourseCounterOnCourseCreated,
  increaseLessonsCounterOnLessonCreated,
  decreaseLessonsCounterOnLessonDeleted,
  increaseCoursePublishedCounterOnCoursePublished,
  decreaseCoursePublishedCounterOnCourseUnpublished,
  increaseCourseSubscriptionsCounterOnCourseSubscriptionCreated,
  decreaseCourseSubscriptionsCounterOnCourseSubscriptionDeleted,
]);
