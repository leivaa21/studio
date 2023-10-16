import { DependencyContainer } from '@studio/dependency-injection';
import { DomainEventSubscriber } from '@studio/events';

import { EventBus } from '../../../../contexts/shared/domain/EventBus';
import { UserWasCreatedHandler } from '../../../../contexts/users/application/events/UserWasCreatedHandler';
import { UserWasCreatedEvent } from '../../../../contexts/users/domain/events/UserWasCreated';

const eventBus = DependencyContainer.get<EventBus>(EventBus);
const userWasCreatedHandler = DependencyContainer.get<
  DomainEventSubscriber<UserWasCreatedEvent>
>(UserWasCreatedHandler);

eventBus.addSubscribers([userWasCreatedHandler]);
