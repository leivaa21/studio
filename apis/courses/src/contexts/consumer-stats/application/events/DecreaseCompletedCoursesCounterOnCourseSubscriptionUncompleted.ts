import { Injectable } from '@studio/dependency-injection';
import { DomainEventClass } from '../../../shared/domain/DomainEvent';
import { EventHandler } from '../../../shared/application/EventHandler';
import { ConsumerStatsRepository } from '../../domain/ConsumerStatsRepository';
import { MongoConsumerStatsRepository } from '../../infrastructure/persistance/mongo/MongoConsumerStatsRepository';
import { ConsumerStatsFinder } from '../services/ConsumerStatsFinder';
import { CourseSubscriptionRepository } from '../../../course-subscriptions/domain/CourseSubscriptionRepository';
import { CourseSubscriptionFinder } from '../../../course-subscriptions/application/services/CourseSubscriptionFinder';
import { CourseSubscriptionId } from '../../../course-subscriptions/domain/CourseSubscriptionId';
import { CourseSubscriptionWasUncompletedEvent } from '../../../course-subscriptions/domain/events/CourseSubscriptionWasUncompleted';
import { MongoCourseSubscriptionRepository } from '../../../course-subscriptions/infrastructure/persistance/mongo/MongoCourseSubscriptionRepository';

@Injectable({
  dependencies: [
    MongoConsumerStatsRepository,
    MongoCourseSubscriptionRepository,
  ],
})
export class DecreaseCompletedCoursesCounterOnCourseSubscriptionUncompletedHandler extends EventHandler<CourseSubscriptionWasUncompletedEvent> {
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
    return [CourseSubscriptionWasUncompletedEvent];
  }
  async on(domainEvent: CourseSubscriptionWasUncompletedEvent): Promise<void> {
    const courseSubscriptionId = CourseSubscriptionId.of(
      domainEvent.aggregateId
    );

    const courseSubscription =
      await this.courseSubscriptionFinder.findByIdOrThrow(courseSubscriptionId);

    const consumerStats = await this.consumerStatsFinder.findOrThrow(
      courseSubscription.userId
    );

    consumerStats.decreaseCompletedCourses();

    await this.consumerStatsRepository.update(consumerStats);
  }
}