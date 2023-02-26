import { UUID } from './valueObjects/UUID';

export interface BaseDomainEventArgs {
  aggregateId: string;
  eventId?: string;
  ocurredOn?: Date;
}
export abstract class DomainEvent {
  static EVENT_NAME: string;
  static fromPrimitives: (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    args: BaseDomainEventArgs & { attributes: any }
  ) => DomainEvent;

  readonly aggreagateId: string;
  readonly eventId: string;
  readonly ocurredOn: Date;
  readonly eventName: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  abstract readonly attributes: any;

  constructor(args: BaseDomainEventArgs & { eventName: string }) {
    const { eventName, aggregateId, eventId, ocurredOn } = args;

    this.eventName = eventName;
    this.aggreagateId = aggregateId;
    this.eventId = eventId || UUID.random().value;
    this.ocurredOn = ocurredOn || new Date();
  }

  abstract toPrimitives(): unknown;
}

export interface DomainEventClass {
  EVENT_NAME: string;
  fromPrimitives(params: {
    aggregateId: string;
    eventId: string;
    ocurredOn: Date;
    attributes: DomainEventAttributtes;
  }): DomainEvent;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type DomainEventAttributtes = any;
