import { AggregateRoot } from '../../shared/domain/AggregateRoot';
import { CourseId } from '../../courses/domain/CourseId';
import { CourseSubscriptionId } from './CourseSubscriptionId';
import { UserId } from './UserId';
import { CourseSubscriptionWasCreatedEvent } from './events/CourseSubscriptionWasCreated';
import { LessonId } from '../../lessons/domain/LessonId';
import { CourseSubscriptionWasDeletedEvent } from './events/CourseSubscriptionWasDeleted';
import { UnableToCompleteLessonError } from './errors/UnableToCompleteLessonError';
import { LessonWasCompletedOnCourseSubscriptionEvent } from './events/LessonWasCompletedOnCourseSubscription';
import { UnableToCompleteError } from './errors/UnableToCompleteError';
import { CourseSubscriptionWasCompletedEvent } from './events/CourseSubscriptionWasCompleted';
import { UnableToUncompleteLessonError } from './errors/UnableToUncompleteLessonError';
import { UnableToUncompleteError } from './errors/UnableToUncompleteError';
import { CourseSubscriptionWasUncompletedEvent } from './events/CourseSubscriptionWasUncompleted';
import { Nullable } from '../../shared/domain/Nullable';

export interface CourseSubscriptionParams {
  readonly id: CourseSubscriptionId;
  readonly userId: UserId;
  readonly courseId: CourseId;
  readonly subscribedAt: Date;
  readonly updatedAt: Date;
  readonly completedLessons: LessonId[];
  readonly completedAt: Nullable<Date>;
}

export interface CourseSubscriptionPrimitives {
  readonly id: string;
  readonly userId: string;
  readonly courseId: string;
  readonly subscribedAt: Date;
  readonly updatedAt: Date;
  readonly completedLessons: string[];
  readonly completedAt: Nullable<Date>;
}

export class CourseSubscription extends AggregateRoot {
  public readonly id: CourseSubscriptionId;
  public readonly userId: UserId;
  public readonly courseId: CourseId;
  private _subscribedAt: Date;
  private _updatedAt: Date;
  private _completedLessons: LessonId[];
  private _completedAt: Nullable<Date>;

  public constructor({
    id,
    userId,
    courseId,
    subscribedAt,
    updatedAt,
    completedLessons,
    completedAt,
  }: CourseSubscriptionParams) {
    super();
    this.id = id;
    this.userId = userId;
    this.courseId = courseId;
    this._subscribedAt = subscribedAt;
    this._updatedAt = updatedAt;
    this._completedLessons = completedLessons;
    this._completedAt = completedAt;
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
      completedAt: null,
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

  public removeLessonFromCompletedLessons(lessonId: LessonId): void {
    if (!this.hasLessonCompleted(lessonId)) {
      throw UnableToUncompleteLessonError.notCompleted(
        this.id.value,
        lessonId.value
      );
    }
    this._completedLessons = this._completedLessons.filter(
      (lesson) => lesson.value !== lessonId.value
    );
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

  public get completed(): boolean {
    return !!this._completedAt;
  }

  public get completedAt(): Nullable<Date> {
    return this._completedAt;
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

  public markAsCompleted(): void {
    if (this.completed) {
      throw UnableToCompleteError.alreadyCompleted(this.id.value);
    }
    this._completedAt = new Date();
    this._updatedAt = new Date();

    const event = CourseSubscriptionWasCompletedEvent.fromPrimitives({
      aggregateId: this.id.value,
    });

    this.commit(event);
  }

  public markAsUncompleted(): void {
    if (!this.completed) {
      throw UnableToUncompleteError.notCompleted(this.id.value);
    }
    this._completedAt = null;
    this._updatedAt = new Date();

    const event = CourseSubscriptionWasUncompletedEvent.fromPrimitives({
      aggregateId: this.id.value,
      attributes: {
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
      completedAt: primitives.completedAt,
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
      completedAt: this._completedAt,
    };
  }
}
