import { Injectable } from '@studio/dependency-injection';
import { DomainEventClass } from '../../../shared/domain/DomainEvent';
import { EventHandler } from '../../../shared/application/EventHandler';
import { InMemoryAsyncEventBus } from '../../../shared/infrastructure/EventBus/InMemoryAsyncEventBus';
import { EventBus } from '../../../shared/domain/EventBus';
import { UserWasDeletedEvent } from '../../domain/events/UserWasDeleted';

@Injectable({
  dependencies: [InMemoryAsyncEventBus],
})
export class DeleteUserContentOnUserDeletedHandler extends EventHandler<UserWasDeletedEvent> {
  public constructor(eventBus?: EventBus) {
    super(eventBus);
  }
  subscribedTo(): DomainEventClass[] {
    return [UserWasDeletedEvent];
  }
  async on(domainEvent: UserWasDeletedEvent): Promise<void> {
    console.log(domainEvent);
  }
}
