import {
  Authorized,
  CurrentUser,
  HttpCode,
  JsonController,
  OnUndefined,
  Param,
  Put,
} from 'routing-controllers';
import { StatusCode } from '@studio/api-utils';
import { Injectable } from '@studio/dependency-injection';

import { User } from '../../auth/user';
import { CommandBus } from '../../../contexts/shared/domain/CommandBus';
import { MarkLessonAsCompletedCommand } from '../../../contexts/course-subscriptions/application/commands/MarkLessonAsCompleted';

@Injectable({
  dependencies: [CommandBus],
})
@JsonController('/course-subscription')
export class MarkLessonAsCompletedController {
  constructor(private readonly commandBus: CommandBus) {}

  @Put('/complete-lesson/:lessonId')
  @HttpCode(StatusCode.OK)
  @OnUndefined(StatusCode.OK)
  @Authorized()
  public async execute(
    @Param('lessonId') lessonId: string,
    @CurrentUser({ required: true }) user: User
  ) {
    await this.commandBus.dispatch<MarkLessonAsCompletedCommand>(
      new MarkLessonAsCompletedCommand({
        userId: user.id,
        lessonId,
      })
    );
  }
}
