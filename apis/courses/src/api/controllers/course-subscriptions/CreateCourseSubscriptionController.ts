import {
  Authorized,
  Body,
  CurrentUser,
  HttpCode,
  JsonController,
  OnUndefined,
  Post,
} from 'routing-controllers';
import { StatusCode, BadRequestError } from '@studio/api-utils';
import { Injectable } from '@studio/dependency-injection';

import { User } from '../../auth/user';
import { InMemoryCommandBus } from '../../../contexts/shared/infrastructure/CommandBus/InMemoryCommandBus';
import { CommandBus } from '../../../contexts/shared/domain/CommandBus';
import { CreateCourseSubscriptionCommand } from '../../../contexts/course-subscriptions/application/commands/CreateCourseSubscription';

@Injectable({
  dependencies: [InMemoryCommandBus],
})
@JsonController('/course-subscriptions')
export class CreateCourseSubscriptionController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post()
  @HttpCode(StatusCode.CREATED)
  @OnUndefined(StatusCode.CREATED)
  @Authorized()
  public async execute(
    @Body() body: { courseId: string },
    @CurrentUser({ required: true }) user: User
  ) {
    const { courseId } = body;

    if (!courseId) {
      throw new BadRequestError(
        'courseId is required when subscribing to a course'
      );
    }

    await this.commandBus.dispatch<CreateCourseSubscriptionCommand>(
      new CreateCourseSubscriptionCommand({
        userId: user.id,
        courseId,
      })
    );
  }
}
