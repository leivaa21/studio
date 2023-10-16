import { BaseDomainEventArgs, DomainEvent } from '@studio/events';

type CourseSubscriptionWasDeletedEventArgs = BaseDomainEventArgs & {
  attributes: { userId: string; courseId: string };
};
export class CourseSubscriptionWasDeletedEvent extends DomainEvent {
  public static EVENT_NAME = 'COURSES.COURSE_SUBSCRIPTION_WAS_DELETED';
  public readonly attributes: { userId: string; courseId: string };

  public static fromPrimitives(
    args: CourseSubscriptionWasDeletedEventArgs
  ): CourseSubscriptionWasDeletedEvent {
    return new this(args);
  }

  private constructor(args: CourseSubscriptionWasDeletedEventArgs) {
    super({
      aggregateId: args.aggregateId,
      eventId: args.eventId,
      ocurredOn: args.ocurredOn,
      eventName: CourseSubscriptionWasDeletedEvent.EVENT_NAME,
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
