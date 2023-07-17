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
import { UpdateCourseCommand } from '../../../contexts/courses/application/commands/UpdateCourse';

@Injectable({
  dependencies: [InMemoryCommandBus],
})
@JsonController('/course')
export class UpdateCourseController {
  constructor(private readonly commandBus: CommandBus) {}

  @Put('/:id')
  @HttpCode(StatusCode.OK)
  @OnUndefined(StatusCode.OK)
  @Authorized()
  public async execute(
    @Body()
    body: { title: string; tags: string[]; description: string },
    @CurrentUser({ required: true }) user: User,
    @Param('id') courseId: string
  ) {
    const { title, tags, description } = body;

    if (!title || !tags || !description) {
      throw new BadRequestError(
        `Params title, tags and description are required`
      );
    }

    await this.commandBus.dispatch(
      new UpdateCourseCommand({
        authorId: user.id,
        courseId,
        title,
        description,
        tags,
      })
    );
  }
}
