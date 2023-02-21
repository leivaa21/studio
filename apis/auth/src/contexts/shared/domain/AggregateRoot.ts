import { DomainEvent } from './DomainEvent';

export abstract class AggregateRoot {
  private domainEvents: Array<DomainEvent> = [];

  pullEvents(): Array<DomainEvent> {
    const events = this.domainEvents.slice();
    this.domainEvents = [];
    return events;
  }

  commit(event: DomainEvent): void {
    this.domainEvents.push(event);
  }

  abstract toPrimitives(): void;
}
