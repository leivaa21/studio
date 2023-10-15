import { Injectable } from '@studio/dependency-injection';
import { DomainEventClass } from '../../../shared/domain/DomainEvent';
import { EventHandler } from '../../../shared/application/EventHandler';
import { CourseSubscriptionWasCreatedEvent } from '../../../course-subscriptions/domain/events/CourseSubscriptionWasCreated';
import { CourseId } from '../../../courses/domain/CourseId';
import { CourseStatsFinder } from '../services/CourseStatsFinder';
import { CourseStatsRepository } from '../../domain/CourseStatsRepository';

@Injectable({
  dependencies: [CourseStatsRepository],
})
export class IncreaseSubscriptionsCounterOnCourseSubscriptionCreatedHandler extends EventHandler<CourseSubscriptionWasCreatedEvent> {
  private readonly courseStatsFinder: CourseStatsFinder;

  public constructor(
    private readonly courseStatsRepository: CourseStatsRepository
  ) {
    super();
    this.courseStatsFinder = new CourseStatsFinder(courseStatsRepository);
  }
  subscribedTo(): DomainEventClass[] {
    return [CourseSubscriptionWasCreatedEvent];
  }
  async on(domainEvent: CourseSubscriptionWasCreatedEvent): Promise<void> {
    const { attributes } = domainEvent;
    const courseId = CourseId.of(attributes.courseId);
    const courseStats = await this.courseStatsFinder.findOrThrow(courseId);

    courseStats.increaseSubscriptions();

    await this.courseStatsRepository.update(courseStats);
  }
}
