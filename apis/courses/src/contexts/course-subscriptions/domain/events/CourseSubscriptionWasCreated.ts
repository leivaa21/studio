import { BaseDomainEventArgs, DomainEvent } from '@studio/events';

type CourseSubscriptionWasCreatedEventArgs = BaseDomainEventArgs & {
  attributes: { userId: string; courseId: string };
};
export class CourseSubscriptionWasCreatedEvent extends DomainEvent {
  public static EVENT_NAME = 'COURSES.COURSE_SUBSCRIPTION_WAS_CREATED';
  public readonly attributes: { userId: string; courseId: string };

  public static fromPrimitives(
    args: CourseSubscriptionWasCreatedEventArgs
  ): CourseSubscriptionWasCreatedEvent {
    return new this(args);
  }

  private constructor(args: CourseSubscriptionWasCreatedEventArgs) {
    super({
      aggregateId: args.aggregateId,
      eventId: args.eventId,
      ocurredOn: args.ocurredOn,
      eventName: CourseSubscriptionWasCreatedEvent.EVENT_NAME,
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
