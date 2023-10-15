import { Get, HttpCode, JsonController, Param } from 'routing-controllers';

import { Injectable } from '@studio/dependency-injection';
import { StatusCode } from '@studio/api-utils';
import { LessonInfoResponse } from '@studio/commons';

import { QueryBus } from '../../../contexts/shared/domain/QueryBus';
import { GetLessonsByCourseQuery } from '../../../contexts/lessons/application/queries/GetLessonsByCourse';
import { Lesson } from '../../../contexts/lessons/domain/Lesson';

@Injectable({
  dependencies: [QueryBus],
})
@JsonController('/lessons')
export class GetLessonsByCourseIdController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get('/by-course/:courseId')
  @HttpCode(StatusCode.OK)
  public async execute(
    @Param('courseId') courseId: string
  ): Promise<LessonInfoResponse[]> {
    const lessons = await this.queryBus.dispatch<
      GetLessonsByCourseQuery,
      Lesson[]
    >(
      new GetLessonsByCourseQuery({
        courseId,
      })
    );

    return lessons.map((lesson) => {
      return {
        id: lesson.id.value,
        courseId: lesson.courseId.value,
        order: lesson.order.value,
        title: lesson.title.value,
      };
    });
  }
}
