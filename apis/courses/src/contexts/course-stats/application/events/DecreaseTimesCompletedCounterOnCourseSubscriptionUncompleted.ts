import { Injectable } from '@studio/dependency-injection';
import { DomainEventClass } from '../../../shared/domain/DomainEvent';
import { EventHandler } from '../../../shared/application/EventHandler';
import { MongoCourseStatsRepository } from '../../infrastructure/persistance/mongo/MongoCourseStatsRepository';
import { CourseStatsFinder } from '../services/CourseStatsFinder';
import { CourseStatsRepository } from '../../domain/CourseStatsRepository';
import { MongoCourseSubscriptionRepository } from '../../../course-subscriptions/infrastructure/persistance/mongo/MongoCourseSubscriptionRepository';
import { CourseSubscriptionWasUncompletedEvent } from '../../../course-subscriptions/domain/events/CourseSubscriptionWasUncompleted';
import { CourseId } from '../../../courses/domain/CourseId';

@Injectable({
  dependencies: [MongoCourseStatsRepository, MongoCourseSubscriptionRepository],
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
