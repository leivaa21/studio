import { StatusCode } from '@studio/api-utils/http';
import { GetUserResponse } from '@studio/commons/dist/contracts/user/GetUserContracts';
import { JsonController, HttpCode, Get, QueryParam } from 'routing-controllers';

@JsonController('/user')
export class GetUserController {
  @Get('')
  @HttpCode(StatusCode.CREATED)
  async GetUser(@QueryParam('email') email: string): Promise<GetUserResponse> {
    return { id: 'SomeIdHere', nickname: 'SomeNicknameHere' };
  }
}
