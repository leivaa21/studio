import {
  Authorized,
  CurrentUser,
  Delete,
  HttpCode,
  JsonController,
  OnUndefined,
  Param,
} from 'routing-controllers';
import { StatusCode } from '@studio/api-utils';
import { Injectable } from '@studio/dependency-injection';

import { User } from '../../auth/user';
import { InMemoryCommandBus } from '../../../contexts/shared/infrastructure/CommandBus/InMemoryCommandBus';
import { CommandBus } from '../../../contexts/shared/domain/CommandBus';
import { DeleteCourseSubscriptionCommand } from '../../../contexts/course-subscriptions/application/commands/DeleteCourseSubscription';

@Injectable({
  dependencies: [InMemoryCommandBus],
})
@JsonController('/course-subscription')
export class DeleteCourseSubscriptionController {
  constructor(private readonly commandBus: CommandBus) {}

  @Delete('/:id')
  @HttpCode(StatusCode.OK)
  @OnUndefined(StatusCode.OK)
  @Authorized()
  public async execute(
    @CurrentUser({ required: true }) user: User,
    @Param('id') id: string
  ) {
    await this.commandBus.dispatch<DeleteCourseSubscriptionCommand>(
      new DeleteCourseSubscriptionCommand({
        id: id,
        userId: user.id,
      })
    );
  }
}
