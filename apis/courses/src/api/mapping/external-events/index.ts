import { DependencyContainer } from '@studio/dependency-injection';
import { UserWasDeletedEvent, DomainEventSubscriber } from '@studio/events';

import { DomainEventClass } from '../../../contexts/shared/domain/DomainEvent';
import { EventBus } from '../../../contexts/shared/domain/EventBus';
import { DeleteUserContentOnUserDeletedHandler } from '../../../contexts/user/application/events/DeleteUserContentOnUserDeleted';

export const ExternalEventsMap: Map<string, DomainEventClass> = new Map([
  [UserWasDeletedEvent.EVENT_NAME, UserWasDeletedEvent],
]);

const eventBus = DependencyContainer.get<EventBus>(EventBus);

const deleteUserContentOnUserDeletedHandler = DependencyContainer.get<
  DomainEventSubscriber<UserWasDeletedEvent>
>(DeleteUserContentOnUserDeletedHandler);

eventBus.addSubscribers([deleteUserContentOnUserDeletedHandler]);
