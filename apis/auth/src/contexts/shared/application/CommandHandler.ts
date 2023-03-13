import { AggregateRoot } from '../domain/AggregateRoot';
import { EventBus } from '../domain/EventBus';
import { Handler } from '../domain/Handler';

export abstract class CommandHandler<Command>
  implements Handler<Command, void>
{
  constructor(private readonly eventBus?: EventBus) {}
  abstract execute(command: Command): Promise<void>;
  protected publishAggregateRootEvents(aggregate: AggregateRoot) {
    if (!this.eventBus) return;
    const events = aggregate.pullEvents();
    this.eventBus.publish(events);
  }
}
