import { DependencyContainer } from '@studio/dependency-injection';

import { EventBus } from '../../../contexts/shared/domain/EventBus';
import { RabbitMQEventBus } from '../../../contexts/shared/infrastructure/EventBus/RabbitMQEventBus';
import { DomainEventSubscriber } from '../../../contexts/shared/domain/DomainEventSubscriber';
import { DomainEventClass } from '../../../contexts/shared/domain/DomainEvent';

import { UserWasDeletedEvent } from '../../../contexts/user/domain/events/UserWasDeleted';
import { DeleteUserContentOnUserDeletedHandler } from '../../../contexts/user/application/events/DeleteUserContentOnUserDeleted';

export const ExternalEventsMap: Map<string, DomainEventClass> = new Map([
  [UserWasDeletedEvent.EVENT_NAME, UserWasDeletedEvent],
]);

const eventBus = DependencyContainer.get<EventBus>(RabbitMQEventBus);

const deleteUserContentOnUserDeletedHandler = DependencyContainer.get<
  DomainEventSubscriber<UserWasDeletedEvent>
>(DeleteUserContentOnUserDeletedHandler);

eventBus.addSubscribers([deleteUserContentOnUserDeletedHandler]);
