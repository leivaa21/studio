import { BaseDomainEventArgs, DomainEvent } from '@studio/events';

type CourseSubscriptionWasUncompletedEventArgs = BaseDomainEventArgs & {
  attributes: { courseId: string };
};

export class CourseSubscriptionWasUncompletedEvent extends DomainEvent {
  public readonly attributes: { courseId: string };
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
