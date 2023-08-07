import { StatusCode } from '@studio/api-utils';
import {
  Authorized,
  CurrentUser,
  Get,
  HttpCode,
  JsonController,
  OnUndefined,
} from 'routing-controllers';
import { Injectable } from '@studio/dependency-injection';
import { User } from '../../auth/user';
import { InMemoryQueryBus } from '../../../contexts/shared/infrastructure/QueryBus/InMemoryQueryBus';
import { QueryBus } from '../../../contexts/shared/domain/QueryBus';
import { Course } from '../../../contexts/courses/domain/Course';
import { SubscribedCourseInfoResponse } from '@studio/commons';
import { GetMySubscribedCoursesQuery } from '../../../contexts/courses/application/queries/GetMySubscribedCourses';

@Injectable({
  dependencies: [InMemoryQueryBus],
})
@JsonController('/courses/subscribed')
export class GetMySubscribedCoursesController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get()
  @HttpCode(StatusCode.OK)
  @OnUndefined(StatusCode.OK)
  @Authorized()
  public async execute(
    @CurrentUser({ required: true }) user: User
  ): Promise<SubscribedCourseInfoResponse[]> {
    const courses = await this.queryBus.dispatch<
      GetMySubscribedCoursesQuery,
      Course[]
    >(
      new GetMySubscribedCoursesQuery({
        userId: user.id,
      })
    );

    return courses.map((course) => {
      return {
        id: course.id.value,
        authorId: course.authorId.value,
        title: course.title.value,
        tags: course.tags.values,
        description: course.description.value,
      };
    });
  }
}
