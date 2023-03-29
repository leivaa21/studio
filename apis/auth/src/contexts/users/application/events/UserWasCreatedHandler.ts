import { info } from '@studio/api-utils';
import { Injectable } from '@studio/dependency-injection';
import { DomainEventClass } from '../../../shared/domain/DomainEvent';
import { DomainEventSubscriber } from '../../../shared/domain/DomainEventSubscriber';
import { UserWasCreatedEvent } from '../../domain/events/UserWasCreated';

@Injectable()
export class UserWasCreatedHandler
  implements DomainEventSubscriber<UserWasCreatedEvent>
{
  subscribedTo(): DomainEventClass[] {
    return [UserWasCreatedEvent];
  }
  async on(domainEvent: UserWasCreatedEvent): Promise<void> {
    const {
      aggregateId,
      attributes: { credentialsType },
    } = domainEvent;
    info(
      `New user has been registered with id: <${aggregateId}> and ${credentialsType} credentials`
    );
  }
}
