import {
  BaseDomainEventArgs,
  DomainEvent,
} from '../../../shared/domain/DomainEvent';

type LessonWasCreatedEventArgs = BaseDomainEventArgs & {
  attributes: { courseId: string };
};
export class LessonWasCreatedEvent extends DomainEvent {
  public static EVENT_NAME: 'LESSONS.LESSON_WAS_CREATED';
  public readonly attributes: { courseId: string };

  public static fromPrimitives(
    args: LessonWasCreatedEventArgs
  ): LessonWasCreatedEvent {
    return new this(args);
  }

  private constructor(args: LessonWasCreatedEventArgs) {
    super({
      aggregateId: args.aggregateId,
      eventId: args.eventId,
      ocurredOn: args.ocurredOn,
      eventName: LessonWasCreatedEvent.EVENT_NAME,
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
