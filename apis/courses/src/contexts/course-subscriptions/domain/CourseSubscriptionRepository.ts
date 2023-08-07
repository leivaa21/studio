import { CourseId } from '../../courses/domain/CourseId';
import { Nullable } from '../../shared/domain/Nullable';
import { CourseSubscription } from './CourseSubscription';
import { UserId } from './UserId';

export interface CourseSubscriptionRepository {
  create(courseSubscription: CourseSubscription): Promise<void>;
  findByUserAndCourse(
    userId: UserId,
    courseId: CourseId
  ): Promise<Nullable<CourseSubscription>>;
  removeByCourseId(courseId: CourseId): Promise<void>;
  findByUser(userId: UserId): Promise<CourseSubscription[]>;
}
