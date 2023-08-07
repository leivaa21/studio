import { CourseId } from '../../../courses/domain/CourseId';
import { Nullable } from '../../../shared/domain/Nullable';
import { CourseSubscription } from '../../domain/CourseSubscription';
import { CourseSubscriptionRepository } from '../../domain/CourseSubscriptionRepository';
import { UserId } from '../../domain/UserId';

export class CourseSubscriptionFinder {
  constructor(private readonly repository: CourseSubscriptionRepository) {}

  public async findByUserAndCourse(
    userId: UserId,
    courseId: CourseId
  ): Promise<Nullable<CourseSubscription>> {
    return this.repository.findByUserAndCourse(userId, courseId);
  }

  public async findByUser(userId: UserId): Promise<CourseSubscription[]> {
    return this.repository.findByUser(userId);
  }
}
