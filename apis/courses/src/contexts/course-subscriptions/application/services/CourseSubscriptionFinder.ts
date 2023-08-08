import { CourseId } from '../../../courses/domain/CourseId';
import { Nullable } from '../../../shared/domain/Nullable';
import { CourseSubscription } from '../../domain/CourseSubscription';
import { CourseSubscriptionId } from '../../domain/CourseSubscriptionId';
import { CourseSubscriptionRepository } from '../../domain/CourseSubscriptionRepository';
import { UserId } from '../../domain/UserId';
import { CourseSubscriptionNotFoundError } from '../../domain/errors/CourseSubscriptionNotFoundError';

export class CourseSubscriptionFinder {
  constructor(private readonly repository: CourseSubscriptionRepository) {}

  public async findByIdOrThrow(
    id: CourseSubscriptionId
  ): Promise<CourseSubscription> {
    const subscription = await this.repository.findById(id);

    if (!subscription) {
      throw CourseSubscriptionNotFoundError.searchedById(id.value);
    }
    return subscription;
  }

  public async findByUserAndCourse(
    userId: UserId,
    courseId: CourseId
  ): Promise<Nullable<CourseSubscription>> {
    return this.repository.findByUserAndCourse(userId, courseId);
  }

  public async findByUserAndCourseOrThrow(
    userId: UserId,
    courseId: CourseId
  ): Promise<CourseSubscription> {
    const subscription = await this.repository.findByUserAndCourse(
      userId,
      courseId
    );

    if (!subscription) {
      throw CourseSubscriptionNotFoundError.searchedByUserAndCourse(
        userId.value,
        courseId.value
      );
    }
    return subscription;
  }

  public async findByUser(userId: UserId): Promise<CourseSubscription[]> {
    return this.repository.findByUser(userId);
  }
}
