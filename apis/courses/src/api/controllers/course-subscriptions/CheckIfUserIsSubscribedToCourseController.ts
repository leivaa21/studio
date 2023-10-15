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
import { User } from '../../auth/user';
import { CheckIfUserIsSubscribedToCourseQuery } from '../../../contexts/course-subscriptions/application/queries/CheckIfUserIsSubscribedToCourse';
import { CheckIfUserIsSubscribedToCourseResponse } from '@studio/commons';

@Injectable({
  dependencies: [QueryBus],
})
@JsonController('/course-subscription/by-course')
export class GetUserCourseSubscriptionToCourseController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get('/:courseId/check')
  @HttpCode(StatusCode.OK)
  @Authorized()
  public async execute(
    @Param('courseId') courseId: string,
    @CurrentUser({ required: true }) user: User
  ): Promise<CheckIfUserIsSubscribedToCourseResponse> {
    return this.queryBus.dispatch<
      CheckIfUserIsSubscribedToCourseQuery,
      CheckIfUserIsSubscribedToCourseResponse
    >(
      new CheckIfUserIsSubscribedToCourseQuery({
        userId: user.id,
        courseId,
      })
    );
  }
}
