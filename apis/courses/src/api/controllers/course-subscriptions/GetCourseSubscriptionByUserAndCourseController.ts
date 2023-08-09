import {
  Authorized,
  CurrentUser,
  Get,
  HttpCode,
  JsonController,
  Param,
} from 'routing-controllers';

import { Injectable } from '@studio/dependency-injection';
import { StatusCode } from '@studio/api-utils';

import { QueryBus } from '../../../contexts/shared/domain/QueryBus';
import { InMemoryQueryBus } from '../../../contexts/shared/infrastructure/QueryBus/InMemoryQueryBus';
import { User } from '../../auth/user';
import { CourseSubscriptionInfoResponse } from '@studio/commons';
import { GetCourseSubscriptionByUserAndCourseQuery } from '../../../contexts/course-subscriptions/application/queries/GetCourseSubscriptionByUserAndCourse';
import { CourseSubscription } from '../../../contexts/course-subscriptions/domain/CourseSubscription';

@Injectable({
  dependencies: [InMemoryQueryBus],
})
@JsonController('/course-subscription/by-course')
export class GetCourseSubscriptionByUserAndCourseController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get('/:courseId')
  @HttpCode(StatusCode.OK)
  @Authorized()
  public async execute(
    @Param('courseId') courseId: string,
    @CurrentUser({ required: true }) user: User
  ): Promise<CourseSubscriptionInfoResponse> {
    const subscription = await this.queryBus.dispatch<
      GetCourseSubscriptionByUserAndCourseQuery,
      CourseSubscription
    >(
      new GetCourseSubscriptionByUserAndCourseQuery({
        userId: user.id,
        courseId,
      })
    );

    return {
      id: subscription.id.value,
      userId: subscription.userId.value,
      courseId: subscription.courseId.value,
      completedLessons: subscription.completedLessons.map(
        (lesson) => lesson.value
      ),
    };
  }
}
