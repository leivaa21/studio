import jwt from 'jsonwebtoken';

import { env } from '../../../api/config/env';
import { CoursesApiService } from '../domain/CoursesApiService';
import { DomainEvent } from '../domain/DomainEvent';
import { Injectable } from '@studio/dependency-injection';

@Injectable()
export class FetchCoursesApiService implements CoursesApiService {
  public sendEvent(event: DomainEvent): void {
    const url = `${env.courses.url}/internal/event`;

    const body = {
      eventName: event.eventName,
      aggregateId: event.aggregateId,
      ocurredOn: event.ocurredOn,
      attributes: event.attributes,
      eventId: event.eventId,
    };

    const data = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: jwt.sign(env.internal.password, env.internal.secret),
      },
      body: JSON.stringify({ body }),
    };

    void fetch(url, data);
  }
}
