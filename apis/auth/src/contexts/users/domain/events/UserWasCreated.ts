import {
  BaseDomainEventArgs,
  DomainEvent,
} from '../../../shared/domain/DomainEvent';

export class UserWasCreatedEvent extends DomainEvent {
  public static EVENT_NAME: 'AUTH.USER_WAS_CREATED';
  public readonly attributes: undefined;

  public static fromPrimitives(args: BaseDomainEventArgs): UserWasCreatedEvent {
    return new this(args);
  }

  private constructor(args: BaseDomainEventArgs) {
    super({
      aggregateId: args.aggregateId,
      eventId: args.eventId,
      ocurredOn: args.ocurredOn,
      eventName: UserWasCreatedEvent.EVENT_NAME,
    });
  }

  public toPrimitives(): {
    aggregateId: string;
    eventId: string;
    ocurredOn: Date;
  } {
    return {
      aggregateId: this.aggreagateId,
      eventId: this.eventId,
      ocurredOn: this.ocurredOn,
    };
  }
}
