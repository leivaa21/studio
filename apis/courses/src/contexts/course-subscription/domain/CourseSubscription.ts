import { AggregateRoot } from '../../shared/domain/AggregateRoot';
import { CourseId } from '../../courses/domain/CourseId';
import { CourseSubscriptionId } from './CourseSubscriptionId';
import { UserId } from './UserId';

export interface CourseSubscriptionParams {
  readonly id: CourseSubscriptionId;
  readonly userId: UserId;
  readonly courseId: CourseId;
  readonly subscribedAt: Date;
  readonly updatedAt: Date;
}

export interface CourseSubscriptionPrimitives {
  readonly id: string;
  readonly userId: string;
  readonly courseId: string;
  readonly subscribedAt: Date;
  readonly updatedAt: Date;
}

export class CourseSubscription extends AggregateRoot {
  public readonly id: CourseSubscriptionId;
  public readonly userId: UserId;
  public readonly courseId: CourseId;
  private _subscribedAt: Date;
  private _updatedAt: Date;

  public constructor({
    id,
    userId,
    courseId,
    subscribedAt,
    updatedAt,
  }: CourseSubscriptionParams) {
    super();
    this.id = id;
    this.userId = userId;
    this.courseId = courseId;
    this._subscribedAt = subscribedAt;
    this._updatedAt = updatedAt;
  }

  public static new({
    userId,
    courseId,
  }: {
    userId: UserId;
    courseId: CourseId;
  }): CourseSubscription {
    const courseSubscriptionId = CourseSubscriptionId.random();

    const courseSubscription = new CourseSubscription({
      id: courseSubscriptionId,
      userId,
      courseId,
      subscribedAt: new Date(),
      updatedAt: new Date(),
    });

    return courseSubscription;
  }

  public get subscribedAt(): Date {
    return this._subscribedAt;
  }

  public get updatedAt(): Date {
    return this._updatedAt;
  }

  public toPrimitives(): CourseSubscriptionPrimitives {
    return {
      id: this.id.value,
      userId: this.userId.value,
      courseId: this.courseId.value,
      subscribedAt: this.subscribedAt,
      updatedAt: this.updatedAt,
    };
  }
}
