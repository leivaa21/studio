import { StatusCode } from '@studio/api-utils';
import { GetUserNicknameResponse } from '@studio/commons';
import { Injectable } from '@studio/dependency-injection';
import { JsonController, HttpCode, Get, Param } from 'routing-controllers';
import { QueryBus } from '../../../contexts/shared/domain/QueryBus';
import { GetUserByIdQuery } from '../../../contexts/users/application/queries/GetUser/GetUserById';
import { User } from '../../../contexts/users/domain/User';

@Injectable({
  dependencies: [QueryBus],
})
@JsonController('/user/:id')
export class GetUserNicknameController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get('/nickname')
  @HttpCode(StatusCode.OK)
  async execute(@Param('id') userId: string): Promise<GetUserNicknameResponse> {
    const user = await this.queryBus.dispatch<GetUserByIdQuery, User>(
      new GetUserByIdQuery({ id: userId })
    );

    return { nickname: user.nickname.value };
  }
}
