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
import { UpdateCourseDescriptionCommand } from '../../../contexts/courses/application/commands/UpdateCourseDescription';

@Injectable({
  dependencies: [CommandBus],
})
@JsonController('/course')
export class UpdateCourseDescriptionController {
  constructor(private readonly commandBus: CommandBus) {}

  @Put('/:id/description')
  @HttpCode(StatusCode.OK)
  @OnUndefined(StatusCode.OK)
  @Authorized()
  public async execute(
    @Body()
    body: { description: string },
    @CurrentUser({ required: true }) user: User,
    @Param('id') courseId: string
  ) {
    const { description } = body;

    if (!description) {
      throw new BadRequestError(
        `Param description is required to update it in a course!`
      );
    }

    await this.commandBus.dispatch<UpdateCourseDescriptionCommand>(
      new UpdateCourseDescriptionCommand({
        authorId: user.id,
        courseId,
        description,
      })
    );
  }
}
