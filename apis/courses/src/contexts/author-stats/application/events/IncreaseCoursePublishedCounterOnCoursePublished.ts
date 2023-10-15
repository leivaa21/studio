import { Injectable } from '@studio/dependency-injection';
import { DomainEventClass } from '../../../shared/domain/DomainEvent';
import { EventHandler } from '../../../shared/application/EventHandler';
import { AuthorStatsRepository } from '../../domain/AuthorStatsRepository';
import { AuthorStatsFinder } from '../services/AuthorStatsFinder';
import { CourseId } from '../../../courses/domain/CourseId';
import { CourseRepository } from '../../../courses/domain/CourseRepository';
import { CourseFinder } from '../../../courses/application/services/CourseFinder';
import { CourseWasPublishedEvent } from '../../../courses/domain/events/CourseWasPublished';

@Injectable({
  dependencies: [AuthorStatsRepository, CourseRepository],
})
export class IncreaseCoursePublishedCounterOnCoursePublishedHandler extends EventHandler<CourseWasPublishedEvent> {
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
    return [CourseWasPublishedEvent];
  }
  async on(domainEvent: CourseWasPublishedEvent): Promise<void> {
    const courseId = CourseId.of(domainEvent.aggregateId);
    const course = await this.courseFinder.findByIdOrThrow(courseId);

    const authorStats = await this.authorStatsFinder.findOrThrow(
      course.authorId
    );

    authorStats.increaseCoursesPublished();

    await this.authorStatsRepository.update(authorStats);
  }
}
