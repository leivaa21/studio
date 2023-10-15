import { Injectable } from '@studio/dependency-injection';
import { DomainEventClass } from '../../../shared/domain/DomainEvent';
import { EventHandler } from '../../../shared/application/EventHandler';
import { CourseWasCreatedEvent } from '../../../courses/domain/events/CourseWasCreated';
import { AuthorStatsRepository } from '../../domain/AuthorStatsRepository';
import { AuthorId } from '../../../courses/domain/AuthorId';
import { AuthorStatsFinder } from '../services/AuthorStatsFinder';
import { AuthorStats } from '../../domain/AuthorStats';

@Injectable({
  dependencies: [AuthorStatsRepository],
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

    const authorStats = await this.findOrCreateAuthorStats(authorId);

    authorStats.increaseCoursesCreated();

    await this.authorStatsRepository.update(authorStats);
  }

  private async findOrCreateAuthorStats(
    authorId: AuthorId
  ): Promise<AuthorStats> {
    const authorStatsFound = await this.authorStatsFinder.find(authorId);

    if (authorStatsFound) return authorStatsFound;

    const newAuthorStats = AuthorStats.new({ authorId });

    await this.authorStatsRepository.create(newAuthorStats);

    return newAuthorStats;
  }
}
