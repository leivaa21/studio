import { Constructor } from './Constructor';
import { Handler } from './Handler';

export abstract class CommandBus {
  abstract subscribe<TCommand extends object>(
    commandType: Constructor<TCommand>,
    commandHandler: Constructor<Handler<TCommand, void>>
  ): void;
  abstract dispatch<TCommand extends object>(command: TCommand): Promise<void>;
}
