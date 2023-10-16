import { Injectable } from '@studio/dependency-injection';
import { DomainEventClass } from '../../../shared/domain/DomainEvent';
import { EventHandler } from '../../../shared/application/EventHandler';
import { EventBus } from '../../../shared/domain/EventBus';
import { UserWasDeletedEvent } from '../../domain/events/UserWasDeleted';
import { CourseRepository } from '../../../courses/domain/CourseRepository';
import { CourseSubscriptionRepository } from '../../../course-subscriptions/domain/CourseSubscriptionRepository';
import { UserId } from '../../../course-subscriptions/domain/UserId';
import { CourseFinder } from '../../../courses/application/services/CourseFinder';
import { LessonRepository } from '../../../lessons/domain/LessonRepository';
import { AuthorStatsRepository } from '../../../author-stats/domain/AuthorStatsRepository';
import { ConsumerStatsRepository } from '../../../consumer-stats/domain/ConsumerStatsRepository';
import { CourseStatsRepository } from '../../../course-stats/domain/CourseStatsRepository';

@Injectable({
  dependencies: [
    CourseRepository,
    LessonRepository,
    CourseSubscriptionRepository,
    AuthorStatsRepository,
    ConsumerStatsRepository,
    CourseStatsRepository,
    EventBus,
  ],
})
export class DeleteUserContentOnUserDeletedHandler extends EventHandler<UserWasDeletedEvent> {
  private readonly courseFinder: CourseFinder;

  public constructor(
    private readonly courseRepository: CourseRepository,
    private readonly lessonRepository: LessonRepository,
    private readonly courseSubscriptionRepository: CourseSubscriptionRepository,
    private readonly authorStatsRepository: AuthorStatsRepository,
    private readonly consumerStatsRepository: ConsumerStatsRepository,
    private readonly courseStatsRepository: CourseStatsRepository,
    eventBus?: EventBus
  ) {
    super(eventBus);
    this.courseFinder = new CourseFinder(courseRepository);
  }
  subscribedTo(): DomainEventClass[] {
    return [UserWasDeletedEvent];
  }
  async on(domainEvent: UserWasDeletedEvent): Promise<void> {
    console.log('LOL');
    const userId = UserId.of(domainEvent.aggregateId);

    const coursesToDelete = await this.courseFinder.findByAuthor(userId);

    coursesToDelete.forEach((course) => {
      if (course.isPublished) {
        course.unpublish();
        this.publishAggregateRootEvents(course);
      }
      void this.lessonRepository.deleteByCourse(course.id);
      void this.courseStatsRepository.delete(course.id);
    });

    void this.courseRepository.deleteByAuthor(userId);
    void this.courseSubscriptionRepository.removeByUser(userId);
    void this.authorStatsRepository.delete(userId);
    void this.consumerStatsRepository.delete(userId);
  }
}
