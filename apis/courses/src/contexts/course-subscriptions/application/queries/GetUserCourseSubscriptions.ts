import { Injectable } from '@studio/dependency-injection';
import { QueryHandler } from '../../../shared/application/QueryHandler';
import { CourseSubscriptionFinder } from '../services/CourseSubscriptionFinder';
import { CourseSubscriptionRepository } from '../../domain/CourseSubscriptionRepository';
import { UserId } from '../../domain/UserId';
import { CourseSubscription } from '../../domain/CourseSubscription';

export class GetUserCourseSubscriptionsQuery {
  public readonly userId: string;

  public constructor(params: { userId: string }) {
    this.userId = params.userId;
  }
}

@Injectable({
  dependencies: [CourseSubscriptionRepository],
})
export class GetUserCourseSubscriptions
  implements
    QueryHandler<GetUserCourseSubscriptionsQuery, CourseSubscription[]>
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
    query: GetUserCourseSubscriptionsQuery
  ): Promise<CourseSubscription[]> {
    const userId = UserId.of(query.userId);

    return this.courseSubscriptionFinder.findByUser(userId);
  }
}
