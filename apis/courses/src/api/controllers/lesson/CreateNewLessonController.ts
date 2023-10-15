import { BadRequestError, StatusCode } from '@studio/api-utils';
import {
  Authorized,
  Body,
  CurrentUser,
  HttpCode,
  JsonController,
  OnUndefined,
  Post,
} from 'routing-controllers';
import { Injectable } from '@studio/dependency-injection';
import { CommandBus } from '../../../contexts/shared/domain/CommandBus';
import { User } from '../../auth/user';
import { CreateNewLessonCommand } from '../../../contexts/lessons/application/commands/CreateNewLesson';

@Injectable({
  dependencies: [CommandBus],
})
@JsonController('/lessons')
export class CreateNewLessonController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post()
  @HttpCode(StatusCode.CREATED)
  @OnUndefined(StatusCode.CREATED)
  @Authorized()
  public async execute(
    @Body() body: { title: string; courseId: string; content: string },
    @CurrentUser({ required: true }) user: User
  ) {
    const { title, content, courseId } = body;

    if (!title || !content || !courseId) {
      throw new BadRequestError(
        `Title, content and courseId are required parameters when creating a new lesson`
      );
    }
    await this.commandBus.dispatch<CreateNewLessonCommand>(
      new CreateNewLessonCommand({
        courseId,
        authorId: user.id,
        title,
        content,
      })
    );
  }
}
