import { Constructor } from './Constructor';
import { Handler } from './Handler';

export interface CommandBus {
  subscribe<TCommand extends object>(
    commandType: Constructor<TCommand>,
    commandHandler: Constructor<Handler<TCommand, void>>
  ): void;
  dispatch<TCommand extends object>(command: TCommand): Promise<void>;
}
