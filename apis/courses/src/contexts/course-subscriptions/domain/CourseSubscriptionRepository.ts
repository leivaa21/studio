import { CourseId } from '../../courses/domain/CourseId';
import { Nullable } from '../../shared/domain/Nullable';
import { CourseSubscription } from './CourseSubscription';
import { CourseSubscriptionId } from './CourseSubscriptionId';
import { UserId } from './UserId';

export abstract class CourseSubscriptionRepository {
  abstract create(courseSubscription: CourseSubscription): Promise<void>;
  abstract findByUserAndCourse(
    userId: UserId,
    courseId: CourseId
  ): Promise<Nullable<CourseSubscription>>;
  abstract removeByCourseId(courseId: CourseId): Promise<void>;
  abstract findByUser(userId: UserId): Promise<CourseSubscription[]>;
  abstract findById(
    id: CourseSubscriptionId
  ): Promise<Nullable<CourseSubscription>>;
  abstract removeById(id: CourseSubscriptionId): Promise<void>;
  abstract removeByUser(userId: UserId): Promise<void>;
  abstract update(courseSubscription: CourseSubscription): Promise<void>;
  abstract findByCourse(courseId: CourseId): Promise<CourseSubscription[]>;
}
