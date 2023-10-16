import { DomainEventSubscriber, DomainEvent } from '@studio/events';

export abstract class EventBus {
  abstract publish(event: Array<DomainEvent>): Promise<void>;
  abstract addSubscribers(
    subscribers: Array<DomainEventSubscriber<DomainEvent>>
  ): void;
}
