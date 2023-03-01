import { StatusCode } from '@studio/api-utils/http';
import { DependencyContainer } from '@studio/dependency-injection';
import {
  JsonController,
  HttpCode,
  Post,
  Body,
  QueryParam,
} from 'routing-controllers';
import { CommandBus } from '../../../contexts/shared/domain/CommandBus';
import { InMemoryCommandBus } from '../../../contexts/shared/infrastructure/CommandBus/InMemoryCommandBus';
import { RegisterNewUserBasicCredentialsCommand } from '../../../contexts/users/application/commands/RegisterNewUser/RegisterNewUserBasicCredentials';
import { BadRequestException } from '../shared/exceptions/BadRequestException';
import { RegisterUserBody } from './dtos/RegisterUserBody';

@JsonController('/users')
export class UserPostController {
  @Post('/register')
  @HttpCode(StatusCode.CREATED)
  async registerWithBasicCredentials(
    @Body() body: RegisterUserBody,
    @QueryParam('credential') credentialsType: string
  ) {
    const commandBus = DependencyContainer.get<CommandBus>(InMemoryCommandBus);

    if (!body.nickname) {
      throw new BadRequestException(
        'Nickname should be defined in request body'
      );
    }

    switch (credentialsType) {
      case 'BASIC':
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
      default:
        throw new BadRequestException('Invalid Credential Type');
    }
  }
}
