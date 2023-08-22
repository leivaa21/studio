export interface EventSended {
  eventName: string;
  aggregateId: string;
  eventId: string;
  ocurredOn: Date;
  attributes: any;
}