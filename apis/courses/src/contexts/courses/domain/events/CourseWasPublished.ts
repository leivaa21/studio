import {
  BaseDomainEventArgs,
  DomainEvent,
} from '../../../shared/domain/DomainEvent';

type CourseWasPublishedEventArgs = BaseDomainEventArgs;
export class CourseWasPublishedEvent extends DomainEvent {
  public static EVENT_NAME: 'COURSES.COURSE_WAS_PUBLISHED';
  public readonly attributes: undefined;

  public static fromPrimitives(
    args: CourseWasPublishedEventArgs
  ): CourseWasPublishedEvent {
    return new this(args);
  }

  private constructor(args: CourseWasPublishedEventArgs) {
    super({
      aggregateId: args.aggregateId,
      eventId: args.eventId,
      ocurredOn: args.ocurredOn,
      eventName: CourseWasPublishedEvent.EVENT_NAME,
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
