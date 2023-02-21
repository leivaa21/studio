import { UUID } from './valueObjects/UUID';

export abstract class DomainEvent {
  static EVENT_NAME: string;
  static fromPrimitives: (params: {
    aggregateId: string;
    eventId: string;
    ocurredOn: Date;
    attributes: DomainEventAttributtes;
  }) => DomainEvent;

  readonly aggreagateId: string;
  readonly eventId: string;
  readonly ocurredOn: Date;
  readonly eventName: string;

  constructor(params: {
    eventName: string;
    aggregateId: string;
    eventId?: string;
    ocurredOn?: Date;
  }) {
    const { eventName, aggregateId, eventId, ocurredOn } = params;

    this.eventName = eventName;
    this.aggreagateId = aggregateId;
    this.eventId = eventId || UUID.random().value;
    this.ocurredOn = ocurredOn || new Date();
  }

  abstract toPrimitives(): DomainEventAttributtes;
}

export type DomainEventClass = {
  EVENT_NAME: string;
  fromPrimitives(params: {
    aggregateId: string;
    eventId: string;
    ocurredOn: Date;
    attributes: DomainEventAttributtes;
  }): DomainEvent;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type DomainEventAttributtes = any;
