import { StatusCode } from '@studio/api-utils';
import { Injectable } from '@studio/dependency-injection';
import { SignUpRequest, AuthorizationResponse } from '@studio/commons';
import { BadRequestError } from '@studio/api-utils';

import { JsonController, HttpCode, Post, Body } from 'routing-controllers';
import { CommandBus } from '../../../contexts/shared/domain/CommandBus';
import { RegisterNewUserBasicCredentialsCommand } from '../../../contexts/users/application/commands/RegisterNewUser/RegisterNewUserBasicCredentials';
import { QueryBus } from '../../../contexts/shared/domain/QueryBus';
import { GetUserByEmailQuery } from '../../../contexts/users/application/queries/GetUser/GetUserByEmail';
import { User } from '../../../contexts/users/domain/User';
import { signJwt } from '../../auth/signJwt';
@Injectable({
  dependencies: [CommandBus, QueryBus],
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
      throw new BadRequestError('Nickname should be defined in request body');
    }

    if (!credentials) {
      throw new BadRequestError(
        'Credentials should be defined in request body'
      );
    }

    if (!credentials.email || !credentials.password) {
      throw new BadRequestError('Invalid credentials body');
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
