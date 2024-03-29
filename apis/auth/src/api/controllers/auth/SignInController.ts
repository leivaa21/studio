import { StatusCode } from '@studio/api-utils';
import { Body, HttpCode, JsonController, Post } from 'routing-controllers';
import { SignInRequest } from '@studio/commons';
import { Injectable } from '@studio/dependency-injection';
import { QueryBus } from '../../../contexts/shared/domain/QueryBus';
import { SignInWithBasicCredentialsQuery } from '../../../contexts/users/application/queries/SignIn/SignInWithBasicCredentials';
import { User } from '../../../contexts/users/domain/User';
import { signJwt } from '../../auth/signJwt';

@Injectable({
  dependencies: [QueryBus],
})
@JsonController('/auth/signin')
export class SignInController {
  constructor(private readonly queryBus: QueryBus) {}

  @Post('/basic')
  @HttpCode(StatusCode.OK)
  public async withBasicCredentials(@Body() body: SignInRequest) {
    const user = await this.queryBus.dispatch<
      SignInWithBasicCredentialsQuery,
      User
    >(
      new SignInWithBasicCredentialsQuery({
        email: body.email,
        password: body.password,
      })
    );

    const token = signJwt({ nickname: user.nickname.value, id: user.id.value });

    return {
      user: { id: user.id.value, nickname: user.nickname.value },
      token: token,
    };
  }
}
