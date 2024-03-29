import { Injectable } from '@studio/dependency-injection';
import { QueryHandler } from '../../../shared/application/QueryHandler';
import { CourseSubscriptionFinder } from '../services/CourseSubscriptionFinder';
import { CourseSubscriptionRepository } from '../../domain/CourseSubscriptionRepository';
import { CourseId } from '../../../courses/domain/CourseId';
import { UserId } from '../../domain/UserId';
import { CheckIfUserIsSubscribedToCourseResponse } from '@studio/commons';

export class CheckIfUserIsSubscribedToCourseQuery {
  public readonly userId: string;
  public readonly courseId: string;

  public constructor(params: { userId: string; courseId: string }) {
    this.userId = params.userId;
    this.courseId = params.courseId;
  }
}

@Injectable({
  dependencies: [CourseSubscriptionRepository],
})
export class CheckIfUserIsSubscribedToCourse
  implements
    QueryHandler<
      CheckIfUserIsSubscribedToCourseQuery,
      CheckIfUserIsSubscribedToCourseResponse
    >
{
  private readonly courseSubscriptionFinder: CourseSubscriptionFinder;

  public constructor(
    courseSubscriptionRepository: CourseSubscriptionRepository
  ) {
    this.courseSubscriptionFinder = new CourseSubscriptionFinder(
      courseSubscriptionRepository
    );
  }
  public async execute(
    query: CheckIfUserIsSubscribedToCourseQuery
  ): Promise<CheckIfUserIsSubscribedToCourseResponse> {
    const userId = UserId.of(query.userId);
    const courseId = CourseId.of(query.courseId);

    const userCourseSubscription =
      await this.courseSubscriptionFinder.findByUserAndCourse(userId, courseId);

    return { isSubscribed: !!userCourseSubscription };
  }
}
