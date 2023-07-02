import {
  BaseDomainEventArgs,
  DomainEvent,
} from '../../../shared/domain/DomainEvent';

type CourseWasCreatedEventArgs = BaseDomainEventArgs & {
  attributes: { authorId: string };
};
export class CourseWasCreatedEvent extends DomainEvent {
  public static EVENT_NAME: 'COURSES.COURSE_WAS_CREATED';
  public readonly attributes: { authorId: string };

  public static fromPrimitives(
    args: CourseWasCreatedEventArgs
  ): CourseWasCreatedEvent {
    return new this(args);
  }

  private constructor(args: CourseWasCreatedEventArgs) {
    super({
      aggregateId: args.aggregateId,
      eventId: args.eventId,
      ocurredOn: args.ocurredOn,
      eventName: CourseWasCreatedEvent.EVENT_NAME,
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
