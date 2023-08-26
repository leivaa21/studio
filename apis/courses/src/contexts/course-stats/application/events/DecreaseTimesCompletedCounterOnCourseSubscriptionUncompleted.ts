import { Injectable } from '@studio/dependency-injection';
import { DomainEventClass } from '../../../shared/domain/DomainEvent';
import { EventHandler } from '../../../shared/application/EventHandler';
import { CourseSubscriptionRepository } from '../../../course-subscriptions/domain/CourseSubscriptionRepository';
import { CourseSubscriptionFinder } from '../../../course-subscriptions/application/services/CourseSubscriptionFinder';
import { CourseSubscriptionId } from '../../../course-subscriptions/domain/CourseSubscriptionId';
import { MongoCourseStatsRepository } from '../../infrastructure/persistance/mongo/MongoCourseStatsRepository';
import { CourseStatsFinder } from '../services/CourseStatsFinder';
import { CourseStatsRepository } from '../../domain/CourseStatsRepository';
import { MongoCourseSubscriptionRepository } from '../../../course-subscriptions/infrastructure/persistance/mongo/MongoCourseSubscriptionRepository';
import { CourseSubscriptionWasUncompletedEvent } from '../../../course-subscriptions/domain/events/CourseSubscriptionWasUncompleted';

@Injectable({
  dependencies: [MongoCourseStatsRepository, MongoCourseSubscriptionRepository],
})
export class DecreaseTimesCompletedCounterOnCourseSubscriptionUncompletedHandler extends EventHandler<CourseSubscriptionWasUncompletedEvent> {
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
    return [CourseSubscriptionWasUncompletedEvent];
  }
  async on(domainEvent: CourseSubscriptionWasUncompletedEvent): Promise<void> {
    const courseSubscriptionId = CourseSubscriptionId.of(
      domainEvent.aggregateId
    );

    const courseSubscription =
      await this.courseSubscriptionFinder.findByIdOrThrow(courseSubscriptionId);

    const courseStats = await this.courseStatsFinder.findOrThrow(
      courseSubscription.courseId
    );

    courseStats.decreaseCurrentTimesCompleted();

    await this.courseStatsRepository.update(courseStats);
  }
}
