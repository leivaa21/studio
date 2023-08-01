import {
  BaseDomainEventArgs,
  DomainEvent,
} from '../../../shared/domain/DomainEvent';

type CourseWasRenamedEventArgs = BaseDomainEventArgs & {
  attributes: { title: string };
};
export class CourseWasRenamedEvent extends DomainEvent {
  public static EVENT_NAME = 'COURSES.COURSE_WAS_RENAMED';
  public readonly attributes: { title: string };

  public static fromPrimitives(
    args: CourseWasRenamedEventArgs
  ): CourseWasRenamedEvent {
    return new this(args);
  }

  private constructor(args: CourseWasRenamedEventArgs) {
    super({
      aggregateId: args.aggregateId,
      eventId: args.eventId,
      ocurredOn: args.ocurredOn,
      eventName: CourseWasRenamedEvent.EVENT_NAME,
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
