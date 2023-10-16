import { Injectable } from '@studio/dependency-injection';
import { DomainEventClass } from '@studio/events';

import { EventHandler } from '../../../shared/application/EventHandler';
import { CourseId } from '../../../courses/domain/CourseId';
import { CourseStatsFinder } from '../services/CourseStatsFinder';
import { CourseStatsRepository } from '../../domain/CourseStatsRepository';
import { CourseSubscriptionWasDeletedEvent } from '../../../course-subscriptions/domain/events/CourseSubscriptionWasDeleted';

@Injectable({
  dependencies: [CourseStatsRepository],
})
export class DecreaseSubscriptionsCounterOnCourseSubscriptionDeletedHandler extends EventHandler<CourseSubscriptionWasDeletedEvent> {
  private readonly courseStatsFinder: CourseStatsFinder;

  public constructor(
    private readonly courseStatsRepository: CourseStatsRepository
  ) {
    super();
    this.courseStatsFinder = new CourseStatsFinder(courseStatsRepository);
  }
  subscribedTo(): DomainEventClass[] {
    return [CourseSubscriptionWasDeletedEvent];
  }
  async on(domainEvent: CourseSubscriptionWasDeletedEvent): Promise<void> {
    const { attributes } = domainEvent;
    const courseId = CourseId.of(attributes.courseId);
    const courseStats = await this.courseStatsFinder.findOrThrow(courseId);

    courseStats.decreaseCurrentSubscriptions();

    await this.courseStatsRepository.update(courseStats);
  }
}
