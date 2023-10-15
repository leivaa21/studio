import { Injectable } from '@studio/dependency-injection';
import {
  Authorized,
  CurrentUser,
  HttpCode,
  JsonController,
  OnUndefined,
  Param,
  Put,
} from 'routing-controllers';
import { CommandBus } from '../../../contexts/shared/domain/CommandBus';
import { StatusCode } from '@studio/api-utils';
import { User } from '../../auth/user';
import { ReorderLessonUpCommand } from '../../../contexts/lessons/application/commands/ReorderLessonUp';
import { ReorderLessonDownCommand } from '../../../contexts/lessons/application/commands/ReorderLessonDown';

@Injectable({
  dependencies: [CommandBus],
})
@JsonController('/lesson/:id')
export class ReorderLessonController {
  constructor(private readonly commandBus: CommandBus) {}

  @Put('/up')
  @HttpCode(StatusCode.OK)
  @OnUndefined(StatusCode.OK)
  @Authorized()
  public async executeUp(
    @CurrentUser({ required: true })
    user: User,
    @Param('id') lessonId: string
  ) {
    await this.commandBus.dispatch<ReorderLessonUpCommand>(
      new ReorderLessonUpCommand({
        authorId: user.id,
        lessonId,
      })
    );
  }
  @Put('/down')
  @HttpCode(StatusCode.OK)
  @OnUndefined(StatusCode.OK)
  @Authorized()
  public async executeDown(
    @CurrentUser({ required: true })
    user: User,
    @Param('id') lessonId: string
  ) {
    await this.commandBus.dispatch<ReorderLessonDownCommand>(
      new ReorderLessonDownCommand({
        authorId: user.id,
        lessonId,
      })
    );
  }
}
