import { Injectable } from '@studio/dependency-injection';
import { DomainEventClass } from '../../../shared/domain/DomainEvent';
import { EventHandler } from '../../../shared/application/EventHandler';
import { AuthorStatsRepository } from '../../domain/AuthorStatsRepository';
import { MongoAuthorStatsRepository } from '../../infrastructure/persistance/mongo/MongoAuthorStatsRepository';
import { AuthorStatsFinder } from '../services/AuthorStatsFinder';
import { CourseFinder } from '../../../courses/application/services/CourseFinder';
import { CourseRepository } from '../../../courses/domain/CourseRepository';
import { CourseId } from '../../../courses/domain/CourseId';
import { CourseSubscriptionWasDeletedEvent } from '../../../course-subscriptions/domain/events/CourseSubscriptionWasDeleted';

@Injectable({
  dependencies: [MongoAuthorStatsRepository, CourseRepository],
})
export class DecreaseCourseSubscriptionsCounterOnCourseSubscriptionDeletedHandler extends EventHandler<CourseSubscriptionWasDeletedEvent> {
  private readonly authorStatsFinder: AuthorStatsFinder;
  private readonly courseFinder: CourseFinder;

  public constructor(
    private readonly authorStatsRepository: AuthorStatsRepository,
    courseRepository: CourseRepository
  ) {
    super();
    this.authorStatsFinder = new AuthorStatsFinder(authorStatsRepository);
    this.courseFinder = new CourseFinder(courseRepository);
  }
  subscribedTo(): DomainEventClass[] {
    return [CourseSubscriptionWasDeletedEvent];
  }
  async on(domainEvent: CourseSubscriptionWasDeletedEvent): Promise<void> {
    const { attributes } = domainEvent;
    const courseId = CourseId.of(attributes.courseId);
    const course = await this.courseFinder.findByIdOrThrow(courseId);

    const authorStats = await this.authorStatsFinder.findOrThrow(
      course.authorId
    );

    authorStats.decreaseCurrentCourseSubscriptionsForOwnCourses();

    await this.authorStatsRepository.update(authorStats);
  }
}
