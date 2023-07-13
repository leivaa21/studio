import { StatusCode } from '@studio/api-utils';
import {
  Authorized,
  CurrentUser,
  Get,
  HttpCode,
  JsonController,
  OnUndefined,
  QueryParam,
} from 'routing-controllers';
import { Injectable } from '@studio/dependency-injection';
import { User } from '../../auth/user';
import { InMemoryQueryBus } from '../../../contexts/shared/infrastructure/QueryBus/InMemoryQueryBus';
import { QueryBus } from '../../../contexts/shared/domain/QueryBus';
import { GetMyCoursesPaginatedQuery } from '../../../contexts/courses/application/queries/GetMyCoursesPaginated';
import { Course } from '../../../contexts/courses/domain/Course';
import { CourseInfoResponse } from '@studio/commons';

@Injectable({
  dependencies: [InMemoryQueryBus],
})
@JsonController('/courses/authored')
export class GetMyCoursesPaginatedController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get()
  @HttpCode(StatusCode.OK)
  @OnUndefined(StatusCode.OK)
  @Authorized()
  public async execute(
    @CurrentUser({ required: true }) user: User,
    @QueryParam('page') page = 0,
    @QueryParam('count') count = 0,
    @QueryParam('title') title: string,
    @QueryParam('tags') tagsAsString: string
  ): Promise<CourseInfoResponse[]> {
    const tags = tagsAsString.split(',').filter((tag) => tag !== '');

    const query = new GetMyCoursesPaginatedQuery({
      authorId: user.id,
      pageSize: count,
      page,
      with: {
        title,
        tags,
      },
    });

    console.log(query);
    try {
      const courses = await this.queryBus.dispatch<
        GetMyCoursesPaginatedQuery,
        Course[]
      >(
        new GetMyCoursesPaginatedQuery({
          authorId: user.id,
          pageSize: count,
          page,
          with: {
            title,
            tags,
          },
        })
      );

      return courses.map((course) => {
        return {
          id: course.id.value,
          title: course.title.value,
          description: course.description.value,
        };
      });
    } catch (err) {
      console.error(err);
    }

    return [];
  }
}
