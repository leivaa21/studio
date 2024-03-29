import { Injectable } from '@studio/dependency-injection';
import {
  Authorized,
  Body,
  CurrentUser,
  HttpCode,
  JsonController,
  OnUndefined,
  Param,
  Put,
} from 'routing-controllers';
import { CommandBus } from '../../../contexts/shared/domain/CommandBus';
import { BadRequestError, StatusCode } from '@studio/api-utils';
import { User } from '../../auth/user';
import { UpdateCourseTagsCommand } from '../../../contexts/courses/application/commands/UpdateCourseTags';

@Injectable({
  dependencies: [CommandBus],
})
@JsonController('/course')
export class UpdateCourseTagsController {
  constructor(private readonly commandBus: CommandBus) {}

  @Put('/:id/tags')
  @HttpCode(StatusCode.OK)
  @OnUndefined(StatusCode.OK)
  @Authorized()
  public async execute(
    @Body()
    body: { tags: string[] },
    @CurrentUser({ required: true }) user: User,
    @Param('id') courseId: string
  ) {
    const { tags } = body;

    if (!tags) {
      throw new BadRequestError(
        `Param tags are required to update them in a course!`
      );
    }

    await this.commandBus.dispatch<UpdateCourseTagsCommand>(
      new UpdateCourseTagsCommand({
        authorId: user.id,
        courseId,
        tags,
      })
    );
  }
}
