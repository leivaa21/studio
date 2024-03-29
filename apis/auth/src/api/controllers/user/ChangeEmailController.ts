import {
  JsonController,
  HttpCode,
  Put,
  Body,
  CurrentUser,
  OnUndefined,
  Authorized,
} from 'routing-controllers';

import { BadRequestError, StatusCode } from '@studio/api-utils';
import { Injectable } from '@studio/dependency-injection';
import { ChangeEmailRequest } from '@studio/commons';

import { AuthUser } from '../../auth/authUser';
import { CommandBus } from '../../../contexts/shared/domain/CommandBus';
import { ChangeEmailCommand } from '../../../contexts/users/application/commands/ChangeEmail';

@Injectable({
  dependencies: [CommandBus],
})
@JsonController('/user/email')
export class ChangeEmailController {
  constructor(private readonly commandBus: CommandBus) {}

  @Put()
  @HttpCode(StatusCode.OK)
  @OnUndefined(StatusCode.OK)
  @Authorized()
  async execute(
    @Body() body: ChangeEmailRequest,
    @CurrentUser({ required: true }) user: AuthUser
  ): Promise<void> {
    const { email } = body;

    if (!email) {
      throw new BadRequestError(
        'Email is required for changing email of a user'
      );
    }

    await this.commandBus.dispatch<ChangeEmailCommand>(
      new ChangeEmailCommand({ email, userId: user.id })
    );
  }
}
