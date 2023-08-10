import {
  BaseDomainEventArgs,
  DomainEvent,
} from '../../../shared/domain/DomainEvent';

type LessonWasCompletedOnCourseSubscriptionEventArgs = BaseDomainEventArgs & {
  attributes: { lessonId: string };
};
export class LessonWasCompletedOnCourseSubscriptionEvent extends DomainEvent {
  public static EVENT_NAME =
    'COURSES.LESSON_WAS_COMPLETED_ON_COURSE_SUBSCRIPTION';
  public readonly attributes: { lessonId: string };

  public static fromPrimitives(
    args: LessonWasCompletedOnCourseSubscriptionEventArgs
  ): LessonWasCompletedOnCourseSubscriptionEvent {
    return new this(args);
  }

  private constructor(args: LessonWasCompletedOnCourseSubscriptionEventArgs) {
    super({
      aggregateId: args.aggregateId,
      eventId: args.eventId,
      ocurredOn: args.ocurredOn,
      eventName: LessonWasCompletedOnCourseSubscriptionEvent.EVENT_NAME,
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
