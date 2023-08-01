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
import { InMemoryCommandBus } from '../../../contexts/shared/infrastructure/CommandBus/InMemoryCommandBus';
import { CommandBus } from '../../../contexts/shared/domain/CommandBus';
import { StatusCode } from '@studio/api-utils';
import { User } from '../../auth/user';
import { PublishCourseCommand } from '../../../contexts/courses/application/commands/PublishCourse';

@Injectable({
  dependencies: [InMemoryCommandBus],
})
@JsonController('/course/:id')
export class PublishCourseController {
  constructor(private readonly commandBus: CommandBus) {}

  @Put('/publish')
  @HttpCode(StatusCode.OK)
  @OnUndefined(StatusCode.OK)
  @Authorized()
  public async execute(
    @CurrentUser({ required: true }) user: User,
    @Param('id') courseId: string
  ) {
    await this.commandBus.dispatch(
      new PublishCourseCommand({
        authorId: user.id,
        courseId,
      })
    );
  }
}
