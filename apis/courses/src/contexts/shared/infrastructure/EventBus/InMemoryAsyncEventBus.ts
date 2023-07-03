import { Injectable } from '@studio/dependency-injection';
import EventEmitter from 'events';
import { DomainEvent } from '../../domain/DomainEvent';
import { DomainEventSubscriber } from '../../domain/DomainEventSubscriber';
import { EventBus } from '../../domain/EventBus';

@Injectable()
export class InMemoryAsyncEventBus extends EventEmitter implements EventBus {
  async publish(events: Array<DomainEvent>): Promise<void> {
    events.map((event) => this.emit(event.eventName, event));
  }
  addSubscribers(subscribers: Array<DomainEventSubscriber<DomainEvent>>): void {
    subscribers.forEach((subscriber) => {
      subscriber.subscribedTo().forEach((event) => {
        this.on(event.EVENT_NAME, subscriber.on.bind(subscriber));
      });
    });
  }
}
