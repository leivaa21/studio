import { Injectable } from '@studio/dependency-injection';
import { DomainEventClass } from '@studio/events';

import { EventHandler } from '../../../shared/application/EventHandler';
import { ConsumerStatsRepository } from '../../domain/ConsumerStatsRepository';
import { ConsumerStatsFinder } from '../services/ConsumerStatsFinder';
import { CourseSubscriptionWasCompletedEvent } from '../../../course-subscriptions/domain/events/CourseSubscriptionWasCompleted';
import { CourseSubscriptionRepository } from '../../../course-subscriptions/domain/CourseSubscriptionRepository';
import { CourseSubscriptionFinder } from '../../../course-subscriptions/application/services/CourseSubscriptionFinder';
import { CourseSubscriptionId } from '../../../course-subscriptions/domain/CourseSubscriptionId';

@Injectable({
  dependencies: [ConsumerStatsRepository, CourseSubscriptionRepository],
})
export class IncreaseCompletedCoursesCounterOnCourseSubscriptionCompletedHandler extends EventHandler<CourseSubscriptionWasCompletedEvent> {
  private readonly consumerStatsFinder: ConsumerStatsFinder;
  private readonly courseSubscriptionFinder: CourseSubscriptionFinder;

  public constructor(
    private readonly consumerStatsRepository: ConsumerStatsRepository,
    courseSubscriptionRepository: CourseSubscriptionRepository
  ) {
    super();
    this.consumerStatsFinder = new ConsumerStatsFinder(consumerStatsRepository);
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

    const consumerStats = await this.consumerStatsFinder.findOrThrow(
      courseSubscription.userId
    );

    consumerStats.increaseCompletedCourses();

    await this.consumerStatsRepository.update(consumerStats);
  }
}
