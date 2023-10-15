import { Injectable } from '@studio/dependency-injection';
import { DomainEventClass } from '../../../shared/domain/DomainEvent';
import { EventHandler } from '../../../shared/application/EventHandler';
import { AuthorStatsRepository } from '../../domain/AuthorStatsRepository';
import { AuthorStatsFinder } from '../services/AuthorStatsFinder';
import { CourseId } from '../../../courses/domain/CourseId';
import { CourseRepository } from '../../../courses/domain/CourseRepository';
import { CourseFinder } from '../../../courses/application/services/CourseFinder';
import { LessonWasDeletedEvent } from '../../../lessons/domain/events/LessonWasDeleted';

@Injectable({
  dependencies: [AuthorStatsRepository, CourseRepository],
})
export class DecreaseLessonCounterOnLessonDeletedHandler extends EventHandler<LessonWasDeletedEvent> {
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
    return [LessonWasDeletedEvent];
  }
  async on(domainEvent: LessonWasDeletedEvent): Promise<void> {
    const { attributes } = domainEvent;
    const courseId = CourseId.of(attributes.courseId);
    const course = await this.courseFinder.findByIdOrThrow(courseId);

    const authorStats = await this.authorStatsFinder.findOrThrow(
      course.authorId
    );

    authorStats.decreaseCurrentLessons();

    await this.authorStatsRepository.update(authorStats);
  }
}
