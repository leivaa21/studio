import { StatusCode } from '@studio/api-utils/http';
import { GetUserResponse } from '@studio/commons/dist/contracts/user/GetUserContracts';
import { Injectable } from '@studio/dependency-injection';
import {
  JsonController,
  HttpCode,
  Get,
  Authorized,
  CurrentUser,
} from 'routing-controllers';
import { AuthUser } from '../../auth/authUser';

@Injectable()
@JsonController('/auth')
@Authorized()
export class GetUserController {
  @Get('/me')
  @HttpCode(StatusCode.OK)
  async GetUser(
    @CurrentUser({ required: true }) user: AuthUser
  ): Promise<GetUserResponse> {
    return { id: user.id, nickname: user.nickname };
  }
}
