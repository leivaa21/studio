import { Injectable } from '@studio/dependency-injection';
import { DomainEventClass } from '@studio/events';

import { EventHandler } from '../../../shared/application/EventHandler';
import { CourseSubscriptionWasCompletedEvent } from '../../../course-subscriptions/domain/events/CourseSubscriptionWasCompleted';
import { CourseSubscriptionRepository } from '../../../course-subscriptions/domain/CourseSubscriptionRepository';
import { CourseSubscriptionFinder } from '../../../course-subscriptions/application/services/CourseSubscriptionFinder';
import { CourseSubscriptionId } from '../../../course-subscriptions/domain/CourseSubscriptionId';
import { CourseStatsFinder } from '../services/CourseStatsFinder';
import { CourseStatsRepository } from '../../domain/CourseStatsRepository';

@Injectable({
  dependencies: [CourseStatsRepository, CourseSubscriptionRepository],
})
export class IncreaseTimesCompletedCounterOnCourseSubscriptionCompletedHandler extends EventHandler<CourseSubscriptionWasCompletedEvent> {
  private readonly courseStatsFinder: CourseStatsFinder;
  private readonly courseSubscriptionFinder: CourseSubscriptionFinder;

  public constructor(
    private readonly courseStatsRepository: CourseStatsRepository,
    courseSubscriptionRepository: CourseSubscriptionRepository
  ) {
    super();
    this.courseStatsFinder = new CourseStatsFinder(courseStatsRepository);
    this.courseSubscriptionFinder = new CourseSubscriptionFinder(
      courseSubscriptionRepository
    );
  }
  subscribedTo(): DomainEventClass[] {
    return [CourseSubscriptionWasCompletedEvent];
  }
  async on(domainEvent: CourseSubscriptionWasCompletedEvent): Promise<void> {
    const courseSubscriptionId = CourseSubscriptionId.of(
      domainEvent.aggregateId
    );

    const courseSubscription =
      await this.courseSubscriptionFinder.findByIdOrThrow(courseSubscriptionId);

    const courseStats = await this.courseStatsFinder.findOrThrow(
      courseSubscription.courseId
    );

    courseStats.increaseTimesCompleted();

    await this.courseStatsRepository.update(courseStats);
  }
}
