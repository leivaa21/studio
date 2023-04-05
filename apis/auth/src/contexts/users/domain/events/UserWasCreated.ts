import {
  BaseDomainEventArgs,
  DomainEvent,
} from '../../../shared/domain/DomainEvent';
import { PossibleUserCredentialsType } from '../PossibleUserCredentials';

type UserWasCreatedEventArgs = BaseDomainEventArgs & {
  attributes: { credentialsType: PossibleUserCredentialsType };
};
export class UserWasCreatedEvent extends DomainEvent {
  public static EVENT_NAME: 'AUTH.USER_WAS_CREATED';
  public readonly attributes: { credentialsType: PossibleUserCredentialsType };

  public static fromPrimitives(
    args: UserWasCreatedEventArgs
  ): UserWasCreatedEvent {
    return new this(args);
  }

  private constructor(args: UserWasCreatedEventArgs) {
    super({
      aggregateId: args.aggregateId,
      eventId: args.eventId,
      ocurredOn: args.ocurredOn,
      eventName: UserWasCreatedEvent.EVENT_NAME,
    });
    this.attributes = args.attributes;
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
