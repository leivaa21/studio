import { Injectable } from '@studio/dependency-injection';
import { DomainEventClass } from '../../../shared/domain/DomainEvent';
import { EventHandler } from '../../../shared/application/EventHandler';
import { EventBus } from '../../../shared/domain/EventBus';
import { CourseSubscriptionRepository } from '../../domain/CourseSubscriptionRepository';
import { CourseSubscriptionFinder } from '../services/CourseSubscriptionFinder';
import { CourseId } from '../../../courses/domain/CourseId';
import { LessonContentWasUpdatedEvent } from '../../../lessons/domain/events/LessonContentWasUpdated';
import { LessonId } from '../../../lessons/domain/LessonId';

@Injectable({
  dependencies: [CourseSubscriptionRepository, EventBus],
})
export class UpdateCourseSubscriptionOnLessonContentUpdatedHandler extends EventHandler<LessonContentWasUpdatedEvent> {
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
    return [LessonContentWasUpdatedEvent];
  }
  async on(domainEvent: LessonContentWasUpdatedEvent): Promise<void> {
    const { attributes } = domainEvent;
    const courseId = CourseId.of(attributes.courseId);
    const lessonId = LessonId.of(domainEvent.aggregateId);

    const courseSubscriptions =
      await this.courseSubscriptionFinder.findByCourse(courseId);

    await Promise.all(
      courseSubscriptions.map(async (courseSubscription) => {
        if (!courseSubscription.hasLessonCompleted(lessonId)) return;

        courseSubscription.removeLessonFromCompletedLessons(lessonId);

        if (courseSubscription.completed) {
          courseSubscription.markAsUncompleted();
        }

        await this.courseSubscriptionRepository.update(courseSubscription);
        this.publishAggregateRootEvents(courseSubscription);
      })
    );
  }
}
