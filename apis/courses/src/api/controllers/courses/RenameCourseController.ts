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
import { InMemoryCommandBus } from '../../../contexts/shared/infrastructure/CommandBus/InMemoryCommandBus';
import { CommandBus } from '../../../contexts/shared/domain/CommandBus';
import { BadRequestError, StatusCode } from '@studio/api-utils';
import { User } from '../../auth/user';
import { RenameCourseCommand } from '../../../contexts/courses/application/commands/RenameCourse';

@Injectable({
  dependencies: [InMemoryCommandBus],
})
@JsonController('/course')
export class RenameCourseController {
  constructor(private readonly commandBus: CommandBus) {}

  @Put('/:id/title')
  @HttpCode(StatusCode.OK)
  @OnUndefined(StatusCode.OK)
  @Authorized()
  public async execute(
    @Body()
    body: { title: string },
    @CurrentUser({ required: true }) user: User,
    @Param('id') courseId: string
  ) {
    const { title } = body;

    if (!title) {
      throw new BadRequestError(`Param title is required to rename a course!`);
    }

    await this.commandBus.dispatch<RenameCourseCommand>(
      new RenameCourseCommand({
        authorId: user.id,
        courseId,
        title,
      })
    );
  }
}
