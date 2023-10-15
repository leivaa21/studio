import { Get, HttpCode, JsonController, Param } from 'routing-controllers';

import { Injectable } from '@studio/dependency-injection';
import { StatusCode } from '@studio/api-utils';
import { CourseInfoResponse } from '@studio/commons';

import { QueryBus } from '../../../contexts/shared/domain/QueryBus';
import { GetCourseByIdQuery } from '../../../contexts/courses/application/queries/GetCourseById';
import { Course } from '../../../contexts/courses/domain/Course';

@Injectable({
  dependencies: [QueryBus],
})
@JsonController('/course')
export class GetCourseByIdController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get('/:id')
  @HttpCode(StatusCode.OK)
  public async execute(
    @Param('id') courseId: string
  ): Promise<CourseInfoResponse> {
    const course = await this.queryBus.dispatch<GetCourseByIdQuery, Course>(
      new GetCourseByIdQuery({
        courseId,
      })
    );

    return {
      id: course.id.value,
      authorId: course.authorId.value,
      title: course.title.value,
      tags: course.tags.values,
      description: course.description.value,
      isPublished: course.isPublished,
      publishedAt: course.publishedAt,
    };
  }
}
