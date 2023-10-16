import { BaseDomainEventArgs, DomainEvent } from '@studio/events';

type UserWasDeletedEventArgs = BaseDomainEventArgs;
export class UserWasDeletedEvent extends DomainEvent {
  public static EVENT_NAME = 'AUTH.USER_WAS_DELETED';
  public readonly attributes: undefined;

  public static fromPrimitives(
    args: UserWasDeletedEventArgs
  ): UserWasDeletedEvent {
    return new this(args);
  }

  private constructor(args: UserWasDeletedEventArgs) {
    super({
      aggregateId: args.aggregateId,
      eventId: args.eventId,
      ocurredOn: args.ocurredOn,
      eventName: UserWasDeletedEvent.EVENT_NAME,
    });
  }

  public toPrimitives(): {
    aggregateId: string;
    eventId: string;
    ocurredOn: Date;
  } {
    return {
      aggregateId: this.aggregateId,
      eventId: this.eventId,
      ocurredOn: this.ocurredOn,
    };
  }
}
