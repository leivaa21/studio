import { Injectable } from '@studio/dependency-injection';
import {
  Authorized,
  BadRequestError,
  Body,
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
import { UpdateLessonCommand } from '../../../contexts/lessons/application/commands/UpdateLesson';
import { UpdateLessonRequest } from '@studio/commons';

@Injectable({
  dependencies: [InMemoryCommandBus],
})
@JsonController('/lesson')
export class UpdateLessonController {
  constructor(private readonly commandBus: CommandBus) {}

  @Put('/:id')
  @HttpCode(StatusCode.OK)
  @OnUndefined(StatusCode.OK)
  @Authorized()
  public async execute(
    @Body()
    body: UpdateLessonRequest,
    @CurrentUser({ required: true }) user: User,
    @Param('id') lessonId: string
  ) {
    const { title, content } = body;

    if (!title || !content) {
      throw new BadRequestError(`Params title and content are required`);
    }

    await this.commandBus.dispatch<UpdateLessonCommand>(
      new UpdateLessonCommand({
        authorId: user.id,
        lessonId,
        title,
        content,
      })
    );
  }
}
