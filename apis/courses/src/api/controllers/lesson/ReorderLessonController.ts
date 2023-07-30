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
import { InMemoryCommandBus } from '../../../contexts/shared/infrastructure/CommandBus/InMemoryCommandBus';
import { CommandBus } from '../../../contexts/shared/domain/CommandBus';
import { StatusCode } from '@studio/api-utils';
import { User } from '../../auth/user';
import { ReorderLessonUpCommand } from '../../../contexts/lessons/application/commands/ReorderLessonUp';

@Injectable({
  dependencies: [InMemoryCommandBus],
})
@JsonController('/lesson')
export class ReorderLessonController {
  constructor(private readonly commandBus: CommandBus) {}

  @Put('/:id/up')
  @HttpCode(StatusCode.OK)
  @OnUndefined(StatusCode.OK)
  @Authorized()
  public async execute(
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
}
