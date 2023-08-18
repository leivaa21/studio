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
import { RenameUserRequest } from '@studio/commons';

import { AuthUser } from '../../auth/authUser';
import { CommandBus } from '../../../contexts/shared/domain/CommandBus';
import { InMemoryCommandBus } from '../../../contexts/shared/infrastructure/CommandBus/InMemoryCommandBus';
import { RenameUserCommand } from '../../../contexts/users/application/commands/RenameUser';

@Injectable({
  dependencies: [InMemoryCommandBus],
})
@JsonController('/user/nickname')
export class RenameUserController {
  constructor(private readonly commandBus: CommandBus) {}

  @Put()
  @HttpCode(StatusCode.OK)
  @OnUndefined(StatusCode.OK)
  @Authorized()
  async GetUser(
    @Body() body: RenameUserRequest,
    @CurrentUser({ required: true }) user: AuthUser
  ): Promise<void> {
    const { nickname } = body;

    if (!nickname) {
      throw new BadRequestError('Nickname is required for renaming a user');
    }

    await this.commandBus.dispatch<RenameUserCommand>(
      new RenameUserCommand({ nickname, userId: user.id })
    );
  }
}
