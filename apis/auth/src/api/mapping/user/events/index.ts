import { DependencyContainer } from '@studio/dependency-injection';
import { DomainEventSubscriber } from '../../../../contexts/shared/domain/DomainEventSubscriber';
import { EventBus } from '../../../../contexts/shared/domain/EventBus';
import { InMemoryAsyncEventBus } from '../../../../contexts/shared/infrastructure/EventBus/InMemoryAsyncEventBus';
import { UserWasCreatedHandler } from '../../../../contexts/users/application/events/UserWasCreatedHandler';
import { UserWasCreatedEvent } from '../../../../contexts/users/domain/events/UserWasCreated';

const eventBus = DependencyContainer.get<EventBus>(InMemoryAsyncEventBus);
const userWasCreatedHandler = DependencyContainer.get<
  DomainEventSubscriber<UserWasCreatedEvent>
>(UserWasCreatedHandler);

eventBus.addSubscribers([userWasCreatedHandler]);
