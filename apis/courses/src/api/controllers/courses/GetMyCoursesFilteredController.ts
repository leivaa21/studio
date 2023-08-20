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
import { GetMyCoursesFilteredQuery } from '../../../contexts/courses/application/queries/GetMyCoursesFiltered';
import { Course } from '../../../contexts/courses/domain/Course';
import { CourseInfoResponse } from '@studio/commons';

@Injectable({
  dependencies: [InMemoryQueryBus],
})
@JsonController('/courses/authored')
export class GetMyCoursesFilteredController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get()
  @HttpCode(StatusCode.OK)
  @OnUndefined(StatusCode.OK)
  @Authorized()
  public async execute(
    @CurrentUser({ required: true }) user: User,
    @QueryParam('title') title?: string,
    @QueryParam('tags') tagsAsString?: string
  ): Promise<CourseInfoResponse[]> {
    const tags = tagsAsString
      ? tagsAsString.split(',').filter((tag) => tag !== '')
      : [];

    const courses = await this.queryBus.dispatch<
      GetMyCoursesFilteredQuery,
      Course[]
    >(
      new GetMyCoursesFilteredQuery({
        authorId: user.id,
        with: {
          title,
          tags,
        },
      })
    );

    return courses.map((course) => {
      return {
        id: course.id.value,
        authorId: course.authorId.value,
        title: course.title.value,
        tags: course.tags.values,
        description: course.description.value,
        isPublished: course.isPublished,
        publishedAt: course.publishedAt,
      };
    });
  }
}
