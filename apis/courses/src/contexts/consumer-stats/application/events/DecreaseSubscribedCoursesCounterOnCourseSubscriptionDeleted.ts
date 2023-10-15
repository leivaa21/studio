import { Injectable } from '@studio/dependency-injection';
import { DomainEventClass } from '../../../shared/domain/DomainEvent';
import { EventHandler } from '../../../shared/application/EventHandler';
import { CourseSubscriptionWasDeletedEvent } from '../../../course-subscriptions/domain/events/CourseSubscriptionWasDeleted';
import { ConsumerStatsRepository } from '../../domain/ConsumerStatsRepository';
import { ConsumerStatsFinder } from '../services/ConsumerStatsFinder';
import { UserId } from '../../../course-subscriptions/domain/UserId';

@Injectable({
  dependencies: [ConsumerStatsRepository],
})
export class DecreaseSubscribedCoursesCounterOnCourseSubscriptionDeletedHandler extends EventHandler<CourseSubscriptionWasDeletedEvent> {
  private readonly consumerStatsFinder: ConsumerStatsFinder;

  public constructor(
    private readonly consumerStatsRepository: ConsumerStatsRepository
  ) {
    super();
    this.consumerStatsFinder = new ConsumerStatsFinder(consumerStatsRepository);
  }
  subscribedTo(): DomainEventClass[] {
    return [CourseSubscriptionWasDeletedEvent];
  }
  async on(domainEvent: CourseSubscriptionWasDeletedEvent): Promise<void> {
    const { attributes } = domainEvent;
    const userId = UserId.of(attributes.userId);

    const consumerStats = await this.consumerStatsFinder.findOrThrow(userId);

    consumerStats.decreaseSubscribedCourses();

    await this.consumerStatsRepository.update(consumerStats);
  }
}
