import { StatusCode } from '@studio/api-utils';
import { Injectable } from '@studio/dependency-injection';
import { SignUpRequest } from '@studio/commons/dist/contracts/auth/SignUpContracts';
import { AuthorizationResponse } from '@studio/commons/dist/contracts/auth/AuthorizationResponse';

import { JsonController, HttpCode, Post, Body } from 'routing-controllers';
import { CommandBus } from '../../../contexts/shared/domain/CommandBus';
import { InMemoryCommandBus } from '../../../contexts/shared/infrastructure/CommandBus/InMemoryCommandBus';
import { RegisterNewUserBasicCredentialsCommand } from '../../../contexts/users/application/commands/RegisterNewUser/RegisterNewUserBasicCredentials';
import { BadRequestException } from '../../errors/BadRequestException';
import { QueryBus } from '../../../contexts/shared/domain/QueryBus';
import { InMemoryQueryBus } from '../../../contexts/shared/infrastructure/QueryBus/InMemoryQueryBus';
import { GetUserByEmailQuery } from '../../../contexts/users/application/queries/GetUser/GetUserByEmail';
import { User } from '../../../contexts/users/domain/User';
import { signJwt } from '../../auth/signJwt';
@Injectable({
  dependencies: [InMemoryCommandBus, InMemoryQueryBus],
})
@JsonController('/auth/signup')
export class SingUpController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus
  ) {}

  @Post('/basic')
  @HttpCode(StatusCode.CREATED)
  async withBasicCredentials(
    @Body() body: SignUpRequest
  ): Promise<AuthorizationResponse> {
    const { nickname, credentials } = body;

    if (!nickname) {
      throw new BadRequestException(
        'Nickname should be defined in request body'
      );
    }

    if (!credentials.email || !credentials.password) {
      throw new BadRequestException('Invalid credentials body');
    }

    await this.commandBus.dispatch(
      new RegisterNewUserBasicCredentialsCommand({
        nickname: nickname,
        email: credentials.email,
        password: credentials.password,
      })
    );

    const user = await this.queryBus.dispatch<GetUserByEmailQuery, User>(
      new GetUserByEmailQuery({ email: credentials.email })
    );

    const token = signJwt({ nickname: user.nickname.value, id: user.id.value });

    return {
      user: { id: user.id.value, nickname: user.nickname.value },
      token,
    };
  }
}
