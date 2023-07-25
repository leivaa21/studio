import { StatusCode } from '@studio/api-utils';
import {
  Authorized,
  BadRequestError,
  Body,
  CurrentUser,
  HttpCode,
  JsonController,
  OnUndefined,
  Post,
} from 'routing-controllers';
import { Injectable } from '@studio/dependency-injection';
import { InMemoryCommandBus } from '../../../contexts/shared/infrastructure/CommandBus/InMemoryCommandBus';
import { CommandBus } from '../../../contexts/shared/domain/CommandBus';
import { User } from '../../auth/user';
import { CreateNewLessonCommand } from '../../../contexts/lessons/application/commands/CreateNewLesson';

@Injectable({
  dependencies: [InMemoryCommandBus],
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
        `Title, content and courseId are required parameters when creating a new course`
      );
    }
    try {
      await this.commandBus.dispatch<CreateNewLessonCommand>(
        new CreateNewLessonCommand({
          courseId,
          authorId: user.id,
          title,
          content,
        })
      );
    } catch (err) {
      console.error(err);
    }
  }
}
