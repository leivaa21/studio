import { DomainEvent } from './DomainEvent';
import { DomainEventSubscriber } from './DomainEventSubscriber';

export abstract class EventBus {
  abstract publish(event: Array<DomainEvent>): Promise<void>;
  abstract addSubscribers(
    subscribers: Array<DomainEventSubscriber<DomainEvent>>
  ): void;
}
