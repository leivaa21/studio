import { Injectable } from '@studio/dependency-injection';
import {
  Authorized,
  CurrentUser,
  Delete,
  HttpCode,
  JsonController,
  OnUndefined,
  Param,
} from 'routing-controllers';
import { InMemoryCommandBus } from '../../../contexts/shared/infrastructure/CommandBus/InMemoryCommandBus';
import { CommandBus } from '../../../contexts/shared/domain/CommandBus';
import { StatusCode } from '@studio/api-utils';
import { User } from '../../auth/user';
import { DeleteLessonCommand } from '../../../contexts/lessons/application/commands/DeleteLesson';

@Injectable({
  dependencies: [InMemoryCommandBus],
})
@JsonController('/lesson')
export class DeleteLessonController {
  constructor(private readonly commandBus: CommandBus) {}

  @Delete('/:id')
  @HttpCode(StatusCode.OK)
  @OnUndefined(StatusCode.OK)
  @Authorized()
  public async execute(
    @CurrentUser({ required: true }) user: User,
    @Param('id') lessonId: string
  ) {
    await this.commandBus.dispatch<DeleteLessonCommand>(
      new DeleteLessonCommand({
        authorId: user.id,
        lessonId,
      })
    );
  }
}
