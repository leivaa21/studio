import { Get, HttpCode, JsonController, Param } from 'routing-controllers';

import { Injectable } from '@studio/dependency-injection';
import { StatusCode } from '@studio/api-utils';
import { LessonResponse } from '@studio/commons';

import { QueryBus } from '../../../contexts/shared/domain/QueryBus';
import { InMemoryQueryBus } from '../../../contexts/shared/infrastructure/QueryBus/InMemoryQueryBus';
import { Lesson } from '../../../contexts/lessons/domain/Lesson';
import { GetLessonByIdQuery } from '../../../contexts/lessons/application/queries/GetLessonById';

@Injectable({
  dependencies: [InMemoryQueryBus],
})
@JsonController('/lesson')
export class GetLessonByIdController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get('/:lessonId')
  @HttpCode(StatusCode.OK)
  public async execute(
    @Param('lessonId') lessonId: string
  ): Promise<LessonResponse> {
    const lesson = await this.queryBus.dispatch<GetLessonByIdQuery, Lesson>(
      new GetLessonByIdQuery({
        lessonId,
      })
    );

    return {
      id: lesson.id.value,
      courseId: lesson.courseId.value,
      order: lesson.order.value,
      title: lesson.title.value,
      content: lesson.content.value,
    };
  }
}
