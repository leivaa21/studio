import { AggregateRoot } from '../../shared/domain/AggregateRoot';
import { CourseId } from '../../courses/domain/CourseId';
import { CourseSubscriptionId } from './CourseSubscriptionId';
import { UserId } from './UserId';
import { CourseSubscriptionWasCreatedEvent } from './events/CourseSubscriptionWasCreated';
import { LessonId } from '../../lessons/domain/LessonId';
import { CourseSubscriptionWasDeletedEvent } from './events/CourseSubscriptionWasDeleted';
import { UnableToCompleteLessonError } from './errors/UnableToCompleteLessonError';
import { LessonWasCompletedOnCourseSubscriptionEvent } from './events/LessonWasCompletedOnCourseSubscription';

export interface CourseSubscriptionParams {
  readonly id: CourseSubscriptionId;
  readonly userId: UserId;
  readonly courseId: CourseId;
  readonly subscribedAt: Date;
  readonly updatedAt: Date;
  readonly completedLessons: LessonId[];
}

export interface CourseSubscriptionPrimitives {
  readonly id: string;
  readonly userId: string;
  readonly courseId: string;
  readonly subscribedAt: Date;
  readonly updatedAt: Date;
  readonly completedLessons: string[];
}

export class CourseSubscription extends AggregateRoot {
  public readonly id: CourseSubscriptionId;
  public readonly userId: UserId;
  public readonly courseId: CourseId;
  private _subscribedAt: Date;
  private _updatedAt: Date;
  private _completedLessons: LessonId[];

  public constructor({
    id,
    userId,
    courseId,
    subscribedAt,
    updatedAt,
    completedLessons,
  }: CourseSubscriptionParams) {
    super();
    this.id = id;
    this.userId = userId;
    this.courseId = courseId;
    this._subscribedAt = subscribedAt;
    this._updatedAt = updatedAt;
    this._completedLessons = completedLessons;
  }

  public static new({
    userId,
    courseId,
  }: {
    userId: UserId;
    courseId: CourseId;
  }): CourseSubscription {
    const courseSubscriptionId = CourseSubscriptionId.random();

    const courseSubscriptionWasCreatedEvent =
      CourseSubscriptionWasCreatedEvent.fromPrimitives({
        aggregateId: courseSubscriptionId.value,
        attributes: {
          userId: userId.value,
          courseId: courseId.value,
        },
      });

    const courseSubscription = new CourseSubscription({
      id: courseSubscriptionId,
      userId,
      courseId,
      subscribedAt: new Date(),
      updatedAt: new Date(),
      completedLessons: [],
    });

    courseSubscription.commit(courseSubscriptionWasCreatedEvent);

    return courseSubscription;
  }

  public hasLessonCompleted(lessonId: LessonId): boolean {
    return !!this.completedLessons.find(
      (lesson) => lesson.value === lessonId.value
    );
  }

  public markLessonAsCompleted(lessonId: LessonId): void {
    if (this.hasLessonCompleted(lessonId)) {
      throw UnableToCompleteLessonError.alreadyCompleted(
        this.id.value,
        lessonId.value
      );
    }
    this._completedLessons.push(lessonId);
    const event = LessonWasCompletedOnCourseSubscriptionEvent.fromPrimitives({
      aggregateId: this.id.value,
      attributes: {
        lessonId: lessonId.value,
      },
    });
    this.commit(event);
    this._updatedAt = new Date();
  }

  public get subscribedAt(): Date {
    return this._subscribedAt;
  }

  public get updatedAt(): Date {
    return this._updatedAt;
  }

  public get completedLessons(): LessonId[] {
    return this._completedLessons;
  }

  public delete(): void {
    const event = CourseSubscriptionWasDeletedEvent.fromPrimitives({
      aggregateId: this.id.value,
      attributes: {
        userId: this.userId.value,
        courseId: this.courseId.value,
      },
    });

    this.commit(event);
  }

  public static fromPrimitives(
    primitives: CourseSubscriptionPrimitives
  ): CourseSubscription {
    return new CourseSubscription({
      id: CourseSubscriptionId.of(primitives.id),
      userId: UserId.of(primitives.userId),
      courseId: CourseId.of(primitives.courseId),
      subscribedAt: primitives.subscribedAt,
      updatedAt: primitives.updatedAt,
      completedLessons: primitives.completedLessons.map((id) =>
        LessonId.of(id)
      ),
    });
  }

  public toPrimitives(): CourseSubscriptionPrimitives {
    return {
      id: this.id.value,
      userId: this.userId.value,
      courseId: this.courseId.value,
      subscribedAt: this.subscribedAt,
      updatedAt: this.updatedAt,
      completedLessons: this.completedLessons.map((id) => id.value),
    };
  }
}
