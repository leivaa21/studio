import { Injectable } from '@studio/dependency-injection';
import { DomainEventClass } from '../../../shared/domain/DomainEvent';
import { EventHandler } from '../../../shared/application/EventHandler';
import { AuthorStatsRepository } from '../../domain/AuthorStatsRepository';
import { MongoAuthorStatsRepository } from '../../infrastructure/persistance/mongo/MongoAuthorStatsRepository';
import { AuthorStatsFinder } from '../services/AuthorStatsFinder';
import { CourseId } from '../../../courses/domain/CourseId';
import { CourseRepository } from '../../../courses/domain/CourseRepository';
import { CourseFinder } from '../../../courses/application/services/CourseFinder';
import { CourseWasUnpublishedEvent } from '../../../courses/domain/events/CourseWasUnpublished';
import { ApiError, ErrorCodes } from '@studio/commons';

@Injectable({
  dependencies: [MongoAuthorStatsRepository, CourseRepository],
})
export class DecreaseCoursePublishedCounterOnCourseUnpublishedHandler extends EventHandler<CourseWasUnpublishedEvent> {
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
    return [CourseWasUnpublishedEvent];
  }
  async on(domainEvent: CourseWasUnpublishedEvent): Promise<void> {
    const courseId = CourseId.of(domainEvent.aggregateId);
    try {
      const course = await this.courseFinder.findByIdOrThrow(courseId);

      const authorStats = await this.authorStatsFinder.findOrThrow(
        course.authorId
      );

      authorStats.decreaseCurrentCoursesPublished();

      await this.authorStatsRepository.update(authorStats);
    } catch (err) {
      if ((err as ApiError).errorCode === ErrorCodes.CourseNotFound) {
        // If Course do not exist user is being deleted!!
        return Promise.resolve();
      }

      if ((err as ApiError).errorCode === ErrorCodes.AuthorStatsNotFound) {
        // If Author stats do not exist user is being deleted!!
        return Promise.resolve();
      }
      throw err;
    }
  }
}
