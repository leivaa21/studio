import { StatusCode } from '@studio/api-utils/http';
import { DependencyContainer } from '@studio/dependency-injection';
import { SignUpRequest } from '@studio/commons/dist/contracts/auth/SignUpContracts';
import { JsonController, HttpCode, Post, Body } from 'routing-controllers';
import { CommandBus } from '../../../contexts/shared/domain/CommandBus';
import { InMemoryCommandBus } from '../../../contexts/shared/infrastructure/CommandBus/InMemoryCommandBus';
import { RegisterNewUserBasicCredentialsCommand } from '../../../contexts/users/application/commands/RegisterNewUser/RegisterNewUserBasicCredentials';
import { BadRequestException } from '../shared/exceptions/BadRequestException';

@JsonController('/users/singup')
export class SingUpController {
  @Post('/basic')
  @HttpCode(StatusCode.CREATED)
  async registerWithBasicCredentials(@Body() body: SignUpRequest) {
    const commandBus = DependencyContainer.get<CommandBus>(InMemoryCommandBus);

    if (!body.nickname) {
      throw new BadRequestException(
        'Nickname should be defined in request body'
      );
    }

    if (!body.credentials.email || !body.credentials.password) {
      throw new BadRequestException('Invalid credentials body');
    }

    await commandBus.dispatch(
      new RegisterNewUserBasicCredentialsCommand({
        nickname: body.nickname,
        email: body.credentials.email,
        password: body.credentials.password,
      })
    );
    return { message: 'Created!' };
  }
}
