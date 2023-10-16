import { BaseDomainEventArgs, DomainEvent } from '@studio/events';

type CourseWasUnpublishedEventArgs = BaseDomainEventArgs;
export class CourseWasUnpublishedEvent extends DomainEvent {
  public static EVENT_NAME = 'COURSES.COURSE_WAS_UNPUBLISHED';
  public readonly attributes: undefined;

  public static fromPrimitives(
    args: CourseWasUnpublishedEventArgs
  ): CourseWasUnpublishedEvent {
    return new this(args);
  }

  private constructor(args: CourseWasUnpublishedEventArgs) {
    super({
      aggregateId: args.aggregateId,
      eventId: args.eventId,
      ocurredOn: args.ocurredOn,
      eventName: CourseWasUnpublishedEvent.EVENT_NAME,
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
