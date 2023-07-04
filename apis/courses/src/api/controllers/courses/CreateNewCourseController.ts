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
import { CreateNewCourseCommand } from '../../../contexts/courses/application/commands/CreateNewCourse';
import { User } from '../../auth/user';

@Injectable({
  dependencies: [InMemoryCommandBus],
})
@JsonController('/courses')
export class CreateNewCourseController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post()
  @HttpCode(StatusCode.CREATED)
  @OnUndefined(StatusCode.CREATED)
  @Authorized()
  public async execute(
    @Body() body: { title: string; description: string },
    @CurrentUser({ required: true }) user: User
  ) {
    const { title, description } = body;

    if (!title || !description) {
      throw new BadRequestError(
        `Title and description are required parameters when creating a new course`
      );
    }

    await this.commandBus.dispatch<CreateNewCourseCommand>(
      new CreateNewCourseCommand({
        title,
        description,
        authorId: user.id,
      })
    );
  }
}
