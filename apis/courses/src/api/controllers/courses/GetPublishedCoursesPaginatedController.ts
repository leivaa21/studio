import { StatusCode } from '@studio/api-utils';
import {
  Get,
  HttpCode,
  JsonController,
  OnUndefined,
  QueryParam,
} from 'routing-controllers';
import { Injectable } from '@studio/dependency-injection';
import { InMemoryQueryBus } from '../../../contexts/shared/infrastructure/QueryBus/InMemoryQueryBus';
import { QueryBus } from '../../../contexts/shared/domain/QueryBus';
import { Course } from '../../../contexts/courses/domain/Course';
import { CourseInfoResponse } from '@studio/commons';
import { GetPublishedCoursesPaginatedQuery } from '../../../contexts/courses/application/queries/GetPublishedCoursesPaginated';

@Injectable({
  dependencies: [InMemoryQueryBus],
})
@JsonController('/courses')
export class GetPublishedCoursesPaginatedController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get()
  @HttpCode(StatusCode.OK)
  @OnUndefined(StatusCode.OK)
  public async execute(
    @QueryParam('page') page = 0,
    @QueryParam('count') count = 0,
    @QueryParam('title') title: string,
    @QueryParam('tags') tagsAsString: string
  ): Promise<CourseInfoResponse[]> {
    const tags = tagsAsString
      ? tagsAsString.split(',').filter((tag) => tag !== '')
      : [];

    const courses = await this.queryBus.dispatch<
      GetPublishedCoursesPaginatedQuery,
      Course[]
    >(
      new GetPublishedCoursesPaginatedQuery({
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
