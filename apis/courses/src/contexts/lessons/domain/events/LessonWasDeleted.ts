import {
  BaseDomainEventArgs,
  DomainEvent,
} from '../../../shared/domain/DomainEvent';

type LessonWasDeletedEventArgs = BaseDomainEventArgs & {
  attributes: { courseId: string };
};
export class LessonWasDeletedEvent extends DomainEvent {
  public static EVENT_NAME = 'LESSONS.LESSON_WAS_DELETED';
  public readonly attributes: { courseId: string };

  public static fromPrimitives(
    args: LessonWasDeletedEventArgs
  ): LessonWasDeletedEvent {
    return new this(args);
  }

  private constructor(args: LessonWasDeletedEventArgs) {
    super({
      aggregateId: args.aggregateId,
      eventId: args.eventId,
      ocurredOn: args.ocurredOn,
      eventName: LessonWasDeletedEvent.EVENT_NAME,
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
