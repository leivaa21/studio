import { CourseId } from '../../../src/contexts/courses/domain/CourseId';
import { CourseSubscription } from '../../../src/contexts/course-subscriptions/domain/CourseSubscription';
import { Builder } from './builder';
import { UserId } from '../../../src/contexts/course-subscriptions/domain/UserId';
import { CourseSubscriptionId } from '../../../src/contexts/course-subscriptions/domain/CourseSubscriptionId';
import { LessonId } from '../../../src/contexts/lessons/domain/LessonId';

export class CourseSubscriptionBuilder implements Builder<CourseSubscription> {
  private _userId: UserId = UserId.random();
  private _courseId: CourseId = CourseId.random();
  private _completedLessons: LessonId[] = [];
  private _completedAt?: Date;

  build(): CourseSubscription {
    return new CourseSubscription({
      id: CourseSubscriptionId.random(),
      userId: this._userId,
      courseId: this._courseId,
      subscribedAt: new Date(),
      updatedAt: new Date(),
      completedLessons: this._completedLessons,
      completedAt: this._completedAt,
    });
  }

  public withUserId(userId: UserId) {
    this._userId = userId;
    return this;
  }

  public withCourseId(courseId: CourseId) {
    this._courseId = courseId;
    return this;
  }

  public withCompletedLessons(completedLessons: LessonId[]) {
    this._completedLessons = completedLessons;
    return this;
  }

  public withCompletedAt(completedAt: Date) {
    this._completedAt = completedAt;
    return this;
  }
}
