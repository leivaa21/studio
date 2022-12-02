import { StatusCode } from '@studio/api-utils/http';
import { JsonController, Get, HttpCode } from 'routing-controllers';

@JsonController('/')
export class HealthController {
  @Get('/')
  @HttpCode(StatusCode.OK)
  health() {
    return { message: 'Everything up!' };
  }
}
