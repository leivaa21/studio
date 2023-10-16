import { BaseDomainEventArgs, DomainEvent } from '@studio/events';

type LessonWasReorderedEventArgs = BaseDomainEventArgs & {
  attributes: { courseId: string };
};
export class LessonWasReorderedEvent extends DomainEvent {
  public static EVENT_NAME = 'LESSONS.LESSON_WAS_REORDERED';
  public readonly attributes: { courseId: string };

  public static fromPrimitives(
    args: LessonWasReorderedEventArgs
  ): LessonWasReorderedEvent {
    return new this(args);
  }

  private constructor(args: LessonWasReorderedEventArgs) {
    super({
      aggregateId: args.aggregateId,
      eventId: args.eventId,
      ocurredOn: args.ocurredOn,
      eventName: LessonWasReorderedEvent.EVENT_NAME,
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
