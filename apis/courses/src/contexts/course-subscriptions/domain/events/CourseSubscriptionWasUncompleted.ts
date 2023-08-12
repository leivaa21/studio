import {
  BaseDomainEventArgs,
  DomainEvent,
} from '../../../shared/domain/DomainEvent';

type CourseSubscriptionWasUncompletedEventArgs = BaseDomainEventArgs;
export class CourseSubscriptionWasUncompletedEvent extends DomainEvent {
  public readonly attributes: undefined;
  public static EVENT_NAME = 'COURSES.COURSE_SUBSCRIPTION_WAS_UNCOMPLETED';

  public static fromPrimitives(
    args: CourseSubscriptionWasUncompletedEventArgs
  ): CourseSubscriptionWasUncompletedEvent {
    return new this(args);
  }

  private constructor(args: CourseSubscriptionWasUncompletedEventArgs) {
    super({
      aggregateId: args.aggregateId,
      eventId: args.eventId,
      ocurredOn: args.ocurredOn,
      eventName: CourseSubscriptionWasUncompletedEvent.EVENT_NAME,
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
