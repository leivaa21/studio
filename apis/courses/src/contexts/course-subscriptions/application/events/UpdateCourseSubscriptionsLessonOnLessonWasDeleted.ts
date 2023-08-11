import { Injectable } from '@studio/dependency-injection';
import { DomainEventClass } from '../../../shared/domain/DomainEvent';
import { EventHandler } from '../../../shared/application/EventHandler';
import { InMemoryAsyncEventBus } from '../../../shared/infrastructure/EventBus/InMemoryAsyncEventBus';
import { EventBus } from '../../../shared/domain/EventBus';
import { MongoCourseSubscriptionRepository } from '../../infrastructure/persistance/mongo/MongoCourseSubscriptionRepository';
import { CourseSubscriptionRepository } from '../../domain/CourseSubscriptionRepository';
import { CourseSubscriptionFinder } from '../services/CourseSubscriptionFinder';
import { LessonId } from '../../../lessons/domain/LessonId';
import { LessonWasDeletedEvent } from '../../../lessons/domain/events/LessonWasDeleted';
import { CourseId } from '../../../courses/domain/CourseId';

@Injectable({
  dependencies: [MongoCourseSubscriptionRepository, InMemoryAsyncEventBus],
})
export class UpdateCourseSubscriptionsLessonOnLessonWasDeletedHandler extends EventHandler<LessonWasDeletedEvent> {
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
    return [LessonWasDeletedEvent];
  }
  async on(domainEvent: LessonWasDeletedEvent): Promise<void> {
    const lessonId = LessonId.of(domainEvent.aggregateId);
    const { attributes } = domainEvent;
    const courseId = CourseId.of(attributes.courseId);

    const courseSubscriptions =
      await this.courseSubscriptionFinder.findByCourse(courseId);

    const courseSubscriptionWithLessonAlreadyCompleted =
      courseSubscriptions.filter((courseSubscription) =>
        courseSubscription.hasLessonCompleted(lessonId)
      );

    await Promise.all(
      courseSubscriptionWithLessonAlreadyCompleted.map(
        async (courseSubscription) => {
          courseSubscription.removeLessonFromCompletedLessons(lessonId);
          await this.courseSubscriptionRepository.update(courseSubscription);
        }
      )
    );
  }
}
