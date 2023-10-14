import { Injectable } from '@studio/dependency-injection';
import { DomainEventClass } from '../../../shared/domain/DomainEvent';
import { EventHandler } from '../../../shared/application/EventHandler';
import { EventBus } from '../../../shared/domain/EventBus';
import { MongoCourseSubscriptionRepository } from '../../infrastructure/persistance/mongo/MongoCourseSubscriptionRepository';
import { CourseSubscriptionRepository } from '../../domain/CourseSubscriptionRepository';
import { LessonWasCompletedOnCourseSubscriptionEvent } from '../../domain/events/LessonWasCompletedOnCourseSubscription';
import { CourseSubscriptionId } from '../../domain/CourseSubscriptionId';
import { CourseSubscriptionFinder } from '../services/CourseSubscriptionFinder';
import { LessonFinder } from '../../../lessons/application/services/LessonFinder';
import { LessonRepository } from '../../../lessons/domain/LessonRepository';
import { MongoLessonRepository } from '../../../lessons/infrastructure/persistance/mongo/MongoLessonRepository';
import { RabbitMQEventBus } from '../../../shared/infrastructure/EventBus/RabbitMQEventBus';

@Injectable({
  dependencies: [
    MongoCourseSubscriptionRepository,
    MongoLessonRepository,
    RabbitMQEventBus,
  ],
})
export class CheckIfCourseWasCompletedOnLessonCompletedHandler extends EventHandler<LessonWasCompletedOnCourseSubscriptionEvent> {
  private readonly courseSubscriptionFinder: CourseSubscriptionFinder;
  private readonly lessonFinder: LessonFinder;
  public constructor(
    private readonly courseSubscriptionRepository: CourseSubscriptionRepository,
    lessonRepository: LessonRepository,
    eventBus?: EventBus
  ) {
    super(eventBus);
    this.courseSubscriptionFinder = new CourseSubscriptionFinder(
      courseSubscriptionRepository
    );
    this.lessonFinder = new LessonFinder(lessonRepository);
  }
  subscribedTo(): DomainEventClass[] {
    return [LessonWasCompletedOnCourseSubscriptionEvent];
  }
  async on(
    domainEvent: LessonWasCompletedOnCourseSubscriptionEvent
  ): Promise<void> {
    const courseSubscriptionId = CourseSubscriptionId.of(
      domainEvent.aggregateId
    );

    const courseSubscription =
      await this.courseSubscriptionFinder.findByIdOrThrow(courseSubscriptionId);

    const lessonsFromCourse = await this.lessonFinder.findByCourseId(
      courseSubscription.courseId
    );

    const nonCompletedLessons = lessonsFromCourse.filter((lesson) => {
      const isCompleted = !!courseSubscription.completedLessons.find(
        (completedLesson) => lesson.id.value === completedLesson.value
      );

      return !isCompleted;
    });

    if (nonCompletedLessons.length === 0) {
      courseSubscription.markAsCompleted();
      await this.courseSubscriptionRepository.update(courseSubscription);
    }

    this.publishAggregateRootEvents(courseSubscription);
  }
}
