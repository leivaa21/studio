import { Injectable } from '@studio/dependency-injection';
import { DomainEventClass } from '../../../shared/domain/DomainEvent';
import { EventHandler } from '../../../shared/application/EventHandler';
import { InMemoryAsyncEventBus } from '../../../shared/infrastructure/EventBus/InMemoryAsyncEventBus';
import { EventBus } from '../../../shared/domain/EventBus';
import { CourseSubscriptionRepository } from '../../domain/CourseSubscriptionRepository';
import { CourseSubscriptionFinder } from '../services/CourseSubscriptionFinder';
import { CourseId } from '../../../courses/domain/CourseId';
import { LessonWasCreatedEvent } from '../../../lessons/domain/events/LessonWasCreated';

@Injectable({
  dependencies: [CourseSubscriptionRepository, InMemoryAsyncEventBus],
})
export class MarkCourseSubscriptionAsNonCompletedOnLessonCreatedHandler extends EventHandler<LessonWasCreatedEvent> {
  private readonly courseSubscriptionFinder: CourseSubscriptionFinder;
  public constructor(
    private readonly courseSubscriptionRepository: CourseSubscriptionRepository,
    eventBus?: EventBus
  ) {
    super(eventBus);
    this.courseSubscriptionFinder = new CourseSubscriptionFinder(
      courseSubscriptionRepository
    );
  }
  subscribedTo(): DomainEventClass[] {
    return [LessonWasCreatedEvent];
  }
  async on(domainEvent: LessonWasCreatedEvent): Promise<void> {
    const { attributes } = domainEvent;
    const courseId = CourseId.of(attributes.courseId);

    const courseSubscriptions =
      await this.courseSubscriptionFinder.findByCourse(courseId);

    await Promise.all(
      courseSubscriptions.map(async (courseSubscription) => {
        if (!courseSubscription.completed) return;
        courseSubscription.markAsUncompleted();
        await this.courseSubscriptionRepository.update(courseSubscription);
        this.publishAggregateRootEvents(courseSubscription);
      })
    );
  }
}
