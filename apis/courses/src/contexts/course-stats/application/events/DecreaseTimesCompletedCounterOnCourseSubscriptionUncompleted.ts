import { Injectable } from '@studio/dependency-injection';
import { DomainEventClass } from '@studio/events';

import { EventHandler } from '../../../shared/application/EventHandler';
import { CourseStatsFinder } from '../services/CourseStatsFinder';
import { CourseStatsRepository } from '../../domain/CourseStatsRepository';
import { CourseSubscriptionWasUncompletedEvent } from '../../../course-subscriptions/domain/events/CourseSubscriptionWasUncompleted';
import { CourseId } from '../../../courses/domain/CourseId';

@Injectable({
  dependencies: [CourseStatsRepository],
})
export class DecreaseTimesCompletedCounterOnCourseSubscriptionUncompletedHandler extends EventHandler<CourseSubscriptionWasUncompletedEvent> {
  private readonly courseStatsFinder: CourseStatsFinder;

  public constructor(
    private readonly courseStatsRepository: CourseStatsRepository
  ) {
    super();
    this.courseStatsFinder = new CourseStatsFinder(courseStatsRepository);
  }
  subscribedTo(): DomainEventClass[] {
    return [CourseSubscriptionWasUncompletedEvent];
  }
  async on(domainEvent: CourseSubscriptionWasUncompletedEvent): Promise<void> {
    const { attributes } = domainEvent;
    const courseId = CourseId.of(attributes.courseId);

    const courseStats = await this.courseStatsFinder.findOrThrow(courseId);

    courseStats.decreaseCurrentTimesCompleted();

    await this.courseStatsRepository.update(courseStats);
  }
}
