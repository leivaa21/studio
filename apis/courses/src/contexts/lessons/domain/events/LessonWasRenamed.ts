import {
  BaseDomainEventArgs,
  DomainEvent,
} from '../../../shared/domain/DomainEvent';

type LessonWasRenamedEventArgs = BaseDomainEventArgs & {
  attributes: { courseId: string };
};
export class LessonWasRenamedEvent extends DomainEvent {
  public static EVENT_NAME = 'LESSONS.LESSON_WAS_RENAMED';
  public readonly attributes: { courseId: string };

  public static fromPrimitives(
    args: LessonWasRenamedEventArgs
  ): LessonWasRenamedEvent {
    return new this(args);
  }

  private constructor(args: LessonWasRenamedEventArgs) {
    super({
      aggregateId: args.aggregateId,
      eventId: args.eventId,
      ocurredOn: args.ocurredOn,
      eventName: LessonWasRenamedEvent.EVENT_NAME,
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
