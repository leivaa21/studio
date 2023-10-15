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
import { CommandBus } from '../../../contexts/shared/domain/CommandBus';
import { StatusCode } from '@studio/api-utils';
import { User } from '../../auth/user';
import { UnpublishCourseCommand } from '../../../contexts/courses/application/commands/UnpublishCourse';

@Injectable({
  dependencies: [CommandBus],
})
@JsonController('/course/:id')
export class UnpublishCourseController {
  constructor(private readonly commandBus: CommandBus) {}

  @Put('/unpublish')
  @HttpCode(StatusCode.OK)
  @OnUndefined(StatusCode.OK)
  @Authorized()
  public async execute(
    @CurrentUser({ required: true }) user: User,
    @Param('id') courseId: string
  ) {
    await this.commandBus.dispatch(
      new UnpublishCourseCommand({
        authorId: user.id,
        courseId,
      })
    );
  }
}
