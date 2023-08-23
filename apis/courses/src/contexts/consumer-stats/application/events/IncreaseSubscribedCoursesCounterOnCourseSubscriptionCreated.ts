import { Injectable } from '@studio/dependency-injection';
import { DomainEventClass } from '../../../shared/domain/DomainEvent';
import { EventHandler } from '../../../shared/application/EventHandler';
import { ConsumerStatsRepository } from '../../domain/ConsumerStatsRepository';
import { MongoConsumerStatsRepository } from '../../infrastructure/persistance/mongo/MongoConsumerStatsRepository';
import { ConsumerStatsFinder } from '../services/ConsumerStatsFinder';
import { CourseSubscriptionWasCreatedEvent } from '../../../course-subscriptions/domain/events/CourseSubscriptionWasCreated';
import { UserId } from '../../../course-subscriptions/domain/UserId';
import { ConsumerStats } from '../../domain/ConsumerStats';

@Injectable({
  dependencies: [MongoConsumerStatsRepository],
})
export class IncreaseSubscribedCoursesCounterOnCourseSubscriptionCreatedHandler extends EventHandler<CourseSubscriptionWasCreatedEvent> {
  private readonly consumerStatsFinder: ConsumerStatsFinder;

  public constructor(
    private readonly consumerStatsRepository: ConsumerStatsRepository
  ) {
    super();
    this.consumerStatsFinder = new ConsumerStatsFinder(consumerStatsRepository);
  }
  subscribedTo(): DomainEventClass[] {
    return [CourseSubscriptionWasCreatedEvent];
  }
  async on(domainEvent: CourseSubscriptionWasCreatedEvent): Promise<void> {
    const { attributes } = domainEvent;
    const userId = UserId.of(attributes.userId);

    const consumerStats = await this.findOrCreateConstumerStats(userId);

    consumerStats.increaseSubscribedCourses();

    await this.consumerStatsRepository.update(consumerStats);
  }

  private async findOrCreateConstumerStats(
    userId: UserId
  ): Promise<ConsumerStats> {
    const consumerStatsFound = await this.consumerStatsFinder.find(userId);

    if (consumerStatsFound) return consumerStatsFound;

    const newConsumerStats = ConsumerStats.new({ userId });

    await this.consumerStatsRepository.create(newConsumerStats);

    return newConsumerStats;
  }
}
