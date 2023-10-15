import { Injectable } from '@studio/dependency-injection';
import { DomainEventClass } from '../../../shared/domain/DomainEvent';
import { EventHandler } from '../../../shared/application/EventHandler';
import { InMemoryAsyncEventBus } from '../../../shared/infrastructure/EventBus/InMemoryAsyncEventBus';
import { EventBus } from '../../../shared/domain/EventBus';
import { CourseSubscriptionRepository } from '../../domain/CourseSubscriptionRepository';
import { CourseWasUnpublishedEvent } from '../../../courses/domain/events/CourseWasUnpublished';
import { CourseId } from '../../../courses/domain/CourseId';

@Injectable({
  dependencies: [CourseSubscriptionRepository, InMemoryAsyncEventBus],
})
export class RemoveCourseSubscriptionsOnUnpublishedHandler extends EventHandler<CourseWasUnpublishedEvent> {
  public constructor(
    private readonly courseSubscriptionRepository: CourseSubscriptionRepository,
    eventBus?: EventBus
  ) {
    super(eventBus);
  }
  subscribedTo(): DomainEventClass[] {
    return [CourseWasUnpublishedEvent];
  }
  async on(domainEvent: CourseWasUnpublishedEvent): Promise<void> {
    const courseId = CourseId.of(domainEvent.aggregateId);
    await this.courseSubscriptionRepository.removeByCourseId(courseId);
  }
}
