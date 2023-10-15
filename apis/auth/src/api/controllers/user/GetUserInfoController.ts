import { StatusCode } from '@studio/api-utils';
import { GetUserInfoResponse } from '@studio/commons';
import { Injectable } from '@studio/dependency-injection';
import { JsonController, HttpCode, Get, Param } from 'routing-controllers';
import { QueryBus } from '../../../contexts/shared/domain/QueryBus';
import { GetUserByIdQuery } from '../../../contexts/users/application/queries/GetUser/GetUserById';
import { User } from '../../../contexts/users/domain/User';
import { PossibleUserCredentials } from '../../../contexts/users/domain/PossibleUserCredentials';

@Injectable({
  dependencies: [QueryBus],
})
@JsonController('/user/:id')
export class GetUserInfoController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get()
  @HttpCode(StatusCode.OK)
  async execute(@Param('id') userId: string): Promise<GetUserInfoResponse> {
    const user = await this.queryBus.dispatch<GetUserByIdQuery, User>(
      new GetUserByIdQuery({ id: userId })
    );

    const credentials = this.formatCredentials(user.credentials);

    return {
      id: user.id.value,
      nickname: user.nickname.value,
      joinedAt: user.createdAt,
      credentials,
    };
  }

  private formatCredentials(credentials: PossibleUserCredentials) {
    if (credentials.type === 'GITHUB') {
      return { type: credentials.type };
    }

    return {
      type: credentials.type,
      email: credentials.email.value,
    };
  }
}
