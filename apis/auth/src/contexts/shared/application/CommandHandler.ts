import { AggregateRoot } from '../domain/AggregateRoot';
import { EventBus } from '../domain/EventBus';

export abstract class CommandHandler<Command> {
  constructor(private readonly eventBus?: EventBus) {}
  abstract execute(command: Command): Promise<void>;
  protected publishAggregateRootEvents(aggregate: AggregateRoot) {
    if (!this.eventBus) return;
    const events = aggregate.pullEvents();
    this.eventBus.publish(events);
  }
}
