import { StatusCode } from '@studio/api-utils/http';
import { DependencyContainer } from '@studio/dependency-injection';
import { JsonController, HttpCode, Post, Body } from 'routing-controllers';
import { CommandBus } from '../../../contexts/shared/domain/CommandBus';
import { InMemoryCommandBus } from '../../../contexts/shared/infrastructure/CommandBus/InMemoryCommandBus';
import { RegisterNewUserBasicCredentialsCommand } from '../../../contexts/users/application/commands/RegisterNewUser/RegisterNewUserBasicCredentials';

@JsonController('/users')
export class UserPostController {
  @Post('/register-basic-credentials')
  @HttpCode(StatusCode.CREATED)
  async registerWithBasicCredentials(
    @Body() body: { nickname: string; email: string; password: string }
  ) {
    const commandBus = DependencyContainer.get<CommandBus>(InMemoryCommandBus);
    await commandBus.dispatch(
      new RegisterNewUserBasicCredentialsCommand({ ...body })
    );
    return { message: 'Created!' };
  }
}
