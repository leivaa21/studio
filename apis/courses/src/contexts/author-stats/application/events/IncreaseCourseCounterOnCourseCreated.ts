import { Injectable } from '@studio/dependency-injection';
import { DomainEventClass } from '../../../shared/domain/DomainEvent';
import { EventHandler } from '../../../shared/application/EventHandler';
import { CourseWasCreatedEvent } from '../../../courses/domain/events/CourseWasCreated';
import { AuthorStatsRepository } from '../../domain/AuthorStatsRepository';
import { MongoAuthorStatsRepository } from '../../infrastructure/persistance/mongo/MongoAuthorStatsRepository';
import { AuthorId } from '../../../courses/domain/AuthorId';
import { AuthorStatsFinder } from '../services/AuthorStatsFinder';

@Injectable({
  dependencies: [MongoAuthorStatsRepository],
})
export class IncreaseCourseCounterOnCourseCreatedHandler extends EventHandler<CourseWasCreatedEvent> {
  private readonly authorStatsFinder: AuthorStatsFinder;

  public constructor(
    private readonly authorStatsRepository: AuthorStatsRepository
  ) {
    super();
    this.authorStatsFinder = new AuthorStatsFinder(authorStatsRepository);
  }
  subscribedTo(): DomainEventClass[] {
    return [CourseWasCreatedEvent];
  }
  async on(domainEvent: CourseWasCreatedEvent): Promise<void> {
    const { attributes } = domainEvent;
    const authorId = AuthorId.of(attributes.authorId);

    const authorStats = await this.authorStatsFinder.findOrThrow(authorId);

    authorStats.increaseCoursesCreated();

    await this.authorStatsRepository.update(authorStats);
  }
}
