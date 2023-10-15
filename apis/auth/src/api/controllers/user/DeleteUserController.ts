import { StatusCode } from '@studio/api-utils';
import { Injectable } from '@studio/dependency-injection';
import {
  JsonController,
  HttpCode,
  Delete,
  CurrentUser,
  Authorized,
  OnUndefined,
} from 'routing-controllers';
import { AuthUser } from '../../auth/authUser';
import { CommandBus } from '../../../contexts/shared/domain/CommandBus';
import { DeleteUserCommand } from '../../../contexts/users/application/commands/DeleteUser';

@Injectable({
  dependencies: [CommandBus],
})
@JsonController('/delete-account')
export class DeleteUserController {
  constructor(private readonly commandBus: CommandBus) {}

  @Delete()
  @HttpCode(StatusCode.OK)
  @Authorized()
  @OnUndefined(StatusCode.OK)
  async execute(@CurrentUser() user: AuthUser): Promise<void> {
    await this.commandBus.dispatch<DeleteUserCommand>(
      new DeleteUserCommand({ userId: user.id })
    );
  }
}
