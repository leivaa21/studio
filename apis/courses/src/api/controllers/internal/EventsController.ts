import { BadRequestError, StatusCode } from '@studio/api-utils';
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
import { EventSended } from '@studio/commons';
import { JwtMiddleware } from '../../middlewares/others/JwtMiddleware';
import { ExternalEventsMap } from '../../mapping/external-events';

@Injectable({
  dependencies: [EventBus],
})
@JsonController('/internal/event')
export class InternalEventsController {
  constructor(private readonly eventBus: EventBus) {}

  @Post()
  @UseBefore(JwtMiddleware)
  @HttpCode(StatusCode.OK)
  @OnUndefined(StatusCode.OK)
  public async execute(@Body() body: EventSended) {
    const { eventName, eventId, aggregateId, ocurredOn, attributes } = body;

    const eventClass = ExternalEventsMap.get(eventName);
    if (!eventClass) {
      throw new BadRequestError(`Unknown Event received <${eventName}>`);
    }

    const event = eventClass.fromPrimitives({
      aggregateId,
      eventId,
      ocurredOn,
      attributes,
    });

    this.eventBus.publish([event]);
  }
}
