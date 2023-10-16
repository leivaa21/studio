import { BaseDomainEventArgs, DomainEvent } from '@studio/events';

type CourseSubscriptionWasCreatedEventArgs = BaseDomainEventArgs;
export class CourseSubscriptionWasCompletedEvent extends DomainEvent {
  public readonly attributes: undefined;
  public static EVENT_NAME = 'COURSES.COURSE_SUBSCRIPTION_WAS_COMPLETED';

  public static fromPrimitives(
    args: CourseSubscriptionWasCreatedEventArgs
  ): CourseSubscriptionWasCompletedEvent {
    return new this(args);
  }

  private constructor(args: CourseSubscriptionWasCreatedEventArgs) {
    super({
      aggregateId: args.aggregateId,
      eventId: args.eventId,
      ocurredOn: args.ocurredOn,
      eventName: CourseSubscriptionWasCompletedEvent.EVENT_NAME,
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
