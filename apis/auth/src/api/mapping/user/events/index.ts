import { DependencyContainer } from '@studio/dependency-injection';
import { DomainEventSubscriber } from '../../../../contexts/shared/domain/DomainEventSubscriber';
import { EventBus } from '../../../../contexts/shared/domain/EventBus';
import { UserWasCreatedHandler } from '../../../../contexts/users/application/events/UserWasCreatedHandler';
import { UserWasCreatedEvent } from '../../../../contexts/users/domain/events/UserWasCreated';
import { UserWasDeletedEvent } from '../../../../contexts/users/domain/events/UserWasDeleted';
import { UserWasDeletedHandler } from '../../../../contexts/users/application/events/UserWasDeletedHandler';

const eventBus = DependencyContainer.get<EventBus>(EventBus);
const userWasCreatedHandler = DependencyContainer.get<
  DomainEventSubscriber<UserWasCreatedEvent>
>(UserWasCreatedHandler);
const userWasDeletedHandler = DependencyContainer.get<
  DomainEventSubscriber<UserWasDeletedEvent>
>(UserWasDeletedHandler);

eventBus.addSubscribers([userWasCreatedHandler, userWasDeletedHandler]);
