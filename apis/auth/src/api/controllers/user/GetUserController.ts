import { StatusCode } from '@studio/api-utils/http';
import { JsonController, HttpCode, Get, QueryParam } from 'routing-controllers';

@JsonController('/user')
export class GetUserController {
  @Get('')
  @HttpCode(StatusCode.CREATED)
  async registerWithBasicCredentials(@QueryParam('email') email: string) {
    return { id: email };
  }
}
