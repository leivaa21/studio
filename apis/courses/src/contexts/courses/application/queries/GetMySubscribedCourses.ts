import { Injectable } from '@studio/dependency-injection';
import { QueryHandler } from '../../../shared/application/QueryHandler';
import { Course } from '../../domain/Course';
import { CourseRepository } from '../../domain/CourseRepository';
import { CourseFinder } from '../services/CourseFinder';
import { QueryBus } from '../../../shared/domain/QueryBus';
import { GetUserCourseSubscriptionsQuery } from '../../../course-subscriptions/application/queries/GetUserCourseSubscriptions';
import { CourseSubscription } from '../../../course-subscriptions/domain/CourseSubscription';

export class GetMySubscribedCoursesQuery {
  public readonly userId: string;
  public readonly with?: {
    title?: string;
    tags?: string[];
  };
  public constructor(params: {
    userId: string;
    with?: {
      title?: string;
      tags?: string[];
    };
  }) {
    this.userId = params.userId;
    this.with = params.with;
  }
}

@Injectable({
  dependencies: [QueryBus, CourseRepository],
})
export class GetMySubscribedCourses
  implements QueryHandler<GetMySubscribedCoursesQuery, Course[]>
{
  private readonly courseFinder: CourseFinder;

  public constructor(
    private readonly queryBus: QueryBus,
    courseRepository: CourseRepository
  ) {
    this.courseFinder = new CourseFinder(courseRepository);
  }
  public async execute(query: GetMySubscribedCoursesQuery): Promise<Course[]> {
    const userCourseSubscriptions = await this.queryBus.dispatch<
      GetUserCourseSubscriptionsQuery,
      CourseSubscription[]
    >(new GetUserCourseSubscriptionsQuery({ userId: query.userId }));

    const courses = await this.courseFinder.findSubscribedWithFilters({
      courseIds: userCourseSubscriptions.map(
        (subscription) => subscription.courseId
      ),
      with: query.with,
    });

    return courses;
  }
}
