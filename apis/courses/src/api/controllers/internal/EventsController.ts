import { StatusCode } from '@studio/api-utils';
import {
  Body,
  HttpCode,
  JsonController,
  OnUndefined,
  Post,
  UseBefore,
} from 'routing-controllers';
import { Injectable } from '@studio/dependency-injection';
import { EventBus } from '../../../contexts/shared/domain/EventBus';
import { InMemoryAsyncEventBus } from '../../../contexts/shared/infrastructure/EventBus/InMemoryAsyncEventBus';
import { EventSended } from '@studio/commons';
import { JwtMiddleware } from '../../middlewares/others/JwtMiddleware';

@Injectable({
  dependencies: [InMemoryAsyncEventBus],
})
@JsonController('/internal/event')
export class InternalEventsController {
  constructor(private readonly eventBus: EventBus) {}

  @Post()
  @UseBefore(JwtMiddleware)
  @HttpCode(StatusCode.OK)
  @OnUndefined(StatusCode.OK)
  public async execute(
    @Body()
    body: EventSended
  ) {
    console.log(body);
  }
}
