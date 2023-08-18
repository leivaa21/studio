import { info } from '@studio/api-utils';
import { Injectable } from '@studio/dependency-injection';
import { DomainEventClass } from '../../../shared/domain/DomainEvent';
import { DomainEventSubscriber } from '../../../shared/domain/DomainEventSubscriber';
import { CoursesApiService } from '../../../shared/domain/CoursesApiService';
import { UserWasDeletedEvent } from '../../domain/events/UserWasDeleted';
import { FetchCoursesApiService } from '../../../shared/infrastructure/FetchCoursesApiService';

@Injectable({
  dependencies: [FetchCoursesApiService],
})
export class UserWasDeletedHandler
  implements DomainEventSubscriber<UserWasDeletedEvent>
{
  constructor(private readonly coursesApiService: CoursesApiService) {}

  subscribedTo(): DomainEventClass[] {
    return [UserWasDeletedEvent];
  }
  async on(domainEvent: UserWasDeletedEvent): Promise<void> {
    const { aggregateId } = domainEvent;
    info(`User with id <${aggregateId}> has been deleted`);

    this.coursesApiService.sendEvent(domainEvent);
  }
}
