import { Injectable } from '@studio/dependency-injection';
import { DomainEventClass } from '../../../shared/domain/DomainEvent';
import { EventHandler } from '../../../shared/application/EventHandler';
import { AuthorStatsRepository } from '../../domain/AuthorStatsRepository';
import { MongoAuthorStatsRepository } from '../../infrastructure/persistance/mongo/MongoAuthorStatsRepository';
import { AuthorStatsFinder } from '../services/AuthorStatsFinder';
import { CourseSubscriptionWasCreatedEvent } from '../../../course-subscriptions/domain/events/CourseSubscriptionWasCreated';
import { MongoCourseRepository } from '../../../courses/infrastructure/persistance/mongo/MongoCourseRepository';
import { CourseFinder } from '../../../courses/application/services/CourseFinder';
import { CourseRepository } from '../../../courses/domain/CourseRepository';
import { CourseId } from '../../../courses/domain/CourseId';

@Injectable({
  dependencies: [MongoAuthorStatsRepository, MongoCourseRepository],
})
export class IncreaseCourseSubscriptionsCounterOnCourseSubscriptionCreatedHandler extends EventHandler<CourseSubscriptionWasCreatedEvent> {
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
    return [CourseSubscriptionWasCreatedEvent];
  }
  async on(domainEvent: CourseSubscriptionWasCreatedEvent): Promise<void> {
    const { attributes } = domainEvent;
    const courseId = CourseId.of(attributes.courseId);
    const course = await this.courseFinder.findByIdOrThrow(courseId);

    const authorStats = await this.authorStatsFinder.findOrThrow(
      course.authorId
    );

    authorStats.increaseCourseSubscriptionsForOwnCourses();

    await this.authorStatsRepository.update(authorStats);
  }
}
