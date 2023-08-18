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
import { ChangePasswordRequest } from '@studio/commons';

import { AuthUser } from '../../auth/authUser';
import { CommandBus } from '../../../contexts/shared/domain/CommandBus';
import { InMemoryCommandBus } from '../../../contexts/shared/infrastructure/CommandBus/InMemoryCommandBus';
import { ChangePasswordCommand } from '../../../contexts/users/application/commands/ChangePassword';

@Injectable({
  dependencies: [InMemoryCommandBus],
})
@JsonController('/user/password')
export class ChangePasswordController {
  constructor(private readonly commandBus: CommandBus) {}

  @Put()
  @HttpCode(StatusCode.OK)
  @OnUndefined(StatusCode.OK)
  @Authorized()
  async execute(
    @Body() body: ChangePasswordRequest,
    @CurrentUser({ required: true }) user: AuthUser
  ): Promise<void> {
    const { oldPassword, newPassword } = body;

    if (!oldPassword || !newPassword) {
      throw new BadRequestError(
        'Old and new password are required for changing password of an user'
      );
    }

    await this.commandBus.dispatch<ChangePasswordCommand>(
      new ChangePasswordCommand({
        password: oldPassword,
        newPassword,
        userId: user.id,
      })
    );
  }
}
