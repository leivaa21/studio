import { Injectable } from '@studio/dependency-injection';
import { DomainEventClass } from '../../../shared/domain/DomainEvent';
import { EventHandler } from '../../../shared/application/EventHandler';
import { InMemoryAsyncEventBus } from '../../../shared/infrastructure/EventBus/InMemoryAsyncEventBus';
import { EventBus } from '../../../shared/domain/EventBus';
import { UserWasDeletedEvent } from '../../domain/events/UserWasDeleted';
import { CourseRepository } from '../../../courses/domain/CourseRepository';
import { CourseSubscriptionRepository } from '../../../course-subscriptions/domain/CourseSubscriptionRepository';
import { UserId } from '../../../course-subscriptions/domain/UserId';
import { CourseFinder } from '../../../courses/application/services/CourseFinder';
import { LessonRepository } from '../../../lessons/domain/LessonRepository';
import { MongoCourseRepository } from '../../../courses/infrastructure/persistance/mongo/MongoCourseRepository';
import { MongoLessonRepository } from '../../../lessons/infrastructure/persistance/mongo/MongoLessonRepository';
import { MongoCourseSubscriptionRepository } from '../../../course-subscriptions/infrastructure/persistance/mongo/MongoCourseSubscriptionRepository';

@Injectable({
  dependencies: [
    MongoCourseRepository,
    MongoLessonRepository,
    MongoCourseSubscriptionRepository,
    InMemoryAsyncEventBus,
  ],
})
export class DeleteUserContentOnUserDeletedHandler extends EventHandler<UserWasDeletedEvent> {
  private readonly courseFinder: CourseFinder;

  public constructor(
    private readonly courseRepository: CourseRepository,
    private readonly lessonRepository: LessonRepository,
    private readonly courseSubscriptionRepository: CourseSubscriptionRepository,
    eventBus?: EventBus
  ) {
    super(eventBus);
    this.courseFinder = new CourseFinder(courseRepository);
  }
  subscribedTo(): DomainEventClass[] {
    return [UserWasDeletedEvent];
  }
  async on(domainEvent: UserWasDeletedEvent): Promise<void> {
    const userId = UserId.of(domainEvent.aggregateId);

    const coursesToDelete = await this.courseFinder.findByAuthor(userId);

    coursesToDelete.forEach((course) => {
      course.unpublish();
      this.publishAggregateRootEvents(course);
      void this.lessonRepository.deleteByCourse(course.id);
    });

    void this.courseRepository.deleteByAuthor(userId);
    void this.courseSubscriptionRepository.removeByUser(userId);
  }
}
