import {
  DomainEventSubscriber,
  DomainEvent,
  DomainEventClass,
} from '@studio/events';

import { AggregateRoot } from '../domain/AggregateRoot';
import { EventBus } from '../domain/EventBus';

export abstract class EventHandler<Event extends DomainEvent>
  implements DomainEventSubscriber<Event>
{
  constructor(private readonly eventBus?: EventBus) {}
  abstract subscribedTo(): DomainEventClass[];
  abstract on(domainEvent: Event): Promise<void>;
  protected publishAggregateRootEvents(aggregate: AggregateRoot) {
    if (!this.eventBus) return;
    const events = aggregate.pullEvents();
    this.eventBus.publish(events);
  }
}
