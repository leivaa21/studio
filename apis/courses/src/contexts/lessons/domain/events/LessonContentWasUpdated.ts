import {
  BaseDomainEventArgs,
  DomainEvent,
} from '../../../shared/domain/DomainEvent';

type LessonContentWasUpdatedEventArgs = BaseDomainEventArgs & {
  attributes: { courseId: string };
};
export class LessonContentWasUpdatedEvent extends DomainEvent {
  public static EVENT_NAME = 'LESSONS.LESSON_CONTENT_WAS_UPDATED';
  public readonly attributes: { courseId: string };

  public static fromPrimitives(
    args: LessonContentWasUpdatedEventArgs
  ): LessonContentWasUpdatedEvent {
    return new this(args);
  }

  private constructor(args: LessonContentWasUpdatedEventArgs) {
    super({
      aggregateId: args.aggregateId,
      eventId: args.eventId,
      ocurredOn: args.ocurredOn,
      eventName: LessonContentWasUpdatedEvent.EVENT_NAME,
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
