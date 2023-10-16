import { Injectable } from '@studio/dependency-injection';
import { DomainEventClass } from '@studio/events';

import { EventHandler } from '../../../shared/application/EventHandler';
import { EventBus } from '../../../shared/domain/EventBus';
import { CourseSubscriptionRepository } from '../../domain/CourseSubscriptionRepository';
import { CourseSubscriptionFinder } from '../services/CourseSubscriptionFinder';
import { LessonId } from '../../../lessons/domain/LessonId';
import { LessonWasDeletedEvent } from '../../../lessons/domain/events/LessonWasDeleted';
import { CourseId } from '../../../courses/domain/CourseId';
import { CourseSubscription } from '../../domain/CourseSubscription';
import { LessonFinder } from '../../../lessons/application/services/LessonFinder';
import { LessonRepository } from '../../../lessons/domain/LessonRepository';

@Injectable({
  dependencies: [CourseSubscriptionRepository, LessonRepository, EventBus],
})
export class UpdateCourseSubscriptionsOnLessonWasDeletedHandler extends EventHandler<LessonWasDeletedEvent> {
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
    return [LessonWasDeletedEvent];
  }
  async on(domainEvent: LessonWasDeletedEvent): Promise<void> {
    const lessonId = LessonId.of(domainEvent.aggregateId);
    const { attributes } = domainEvent;
    const courseId = CourseId.of(attributes.courseId);

    const courseSubscriptions =
      await this.courseSubscriptionFinder.findByCourse(courseId);

    await this.deleteLessonFromCompletedLessonsOnCourseSubscriptions(
      lessonId,
      courseSubscriptions
    );

    await this.markAsCompletedCoursesWithNoUncompletedLessonsRemaining(
      courseId,
      courseSubscriptions
    );
  }

  private async deleteLessonFromCompletedLessonsOnCourseSubscriptions(
    lessonId: LessonId,
    courseSubscriptions: CourseSubscription[]
  ) {
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

  private async markAsCompletedCoursesWithNoUncompletedLessonsRemaining(
    courseId: CourseId,
    courseSubscriptions: CourseSubscription[]
  ): Promise<void> {
    const uncompletedCourseSubscriptions = courseSubscriptions.filter(
      (courseSubscription) => !courseSubscription.completed
    );

    const lessonsFromCourse = await this.lessonFinder.findByCourseId(courseId);

    await Promise.all(
      uncompletedCourseSubscriptions.map(async (courseSubscription) => {
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
      })
    );
  }
}
