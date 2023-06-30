import { StatusCode } from '@studio/api-utils';
import { Injectable } from '@studio/dependency-injection';
import { JsonController, Get, HttpCode } from 'routing-controllers';

@JsonController('/')
@Injectable()
export class HealthController {
  @Get('/')
  @HttpCode(StatusCode.OK)
  health() {
    return { message: 'Everything up!' };
  }
}
