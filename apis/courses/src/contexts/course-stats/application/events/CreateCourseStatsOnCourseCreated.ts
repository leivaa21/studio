import { Injectable } from '@studio/dependency-injection';
import { DomainEventClass } from '../../../shared/domain/DomainEvent';
import { EventHandler } from '../../../shared/application/EventHandler';
import { CourseId } from '../../../courses/domain/CourseId';
import { CourseStatsRepository } from '../../domain/CourseStatsRepository';
import { CourseWasCreatedEvent } from '../../../courses/domain/events/CourseWasCreated';
import { CourseStats } from '../../domain/CourseStats';

@Injectable({
  dependencies: [CourseStatsRepository],
})
export class CreateCourseStatsOnCourseCreatedHandler extends EventHandler<CourseWasCreatedEvent> {
  public constructor(
    private readonly courseStatsRepository: CourseStatsRepository
  ) {
    super();
  }
  subscribedTo(): DomainEventClass[] {
    return [CourseWasCreatedEvent];
  }
  async on(domainEvent: CourseWasCreatedEvent): Promise<void> {
    const courseId = CourseId.of(domainEvent.aggregateId);

    const courseStats = CourseStats.new({ courseId });

    await this.courseStatsRepository.create(courseStats);
  }
}
