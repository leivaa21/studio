import { DependencyContainer, Injectable } from '@studio/dependency-injection';
import { CommandHandler } from '../../application/CommandHandler';
import { CommandBus } from '../../domain/CommandBus';
import { Constructor } from '../../domain/Constructor';

@Injectable()
export class InMemoryCommandBus implements CommandBus {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private _subscriptions: Map<string, CommandHandler<any>>;
  constructor() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    this._subscriptions = new Map<string, CommandHandler<any>>();
  }
  public subscribe<TCommand extends object>(
    commandType: Constructor<TCommand>,
    commandHandler: Constructor<CommandHandler<TCommand>>
  ): void {
    const commandName = commandType.name;
    const isAlreadySubscribed = this.isAlreadySubscribed(commandName);
    if (isAlreadySubscribed) {
      throw new Error(`${commandName} is already registered on the CommandBus`);
    }
    const handler =
      DependencyContainer.get<CommandHandler<TCommand>>(commandHandler);
    this._subscriptions.set(commandName, handler);
  }
  public async dispatch<TCommand extends object>(
    command: TCommand
  ): Promise<void> {
    const commandName = command.constructor.name;
    const isAlreadySubscribed = this.isAlreadySubscribed(commandName);
    if (!isAlreadySubscribed) {
      throw new Error(`${commandName} is not registered on the CommandBus`);
    }

    const handler = this._subscriptions.get(commandName);

    if (!handler) {
      throw new Error(
        `${commandName}'s handler is not registered on the CommandBus`
      );
    }

    await handler.execute(command);
  }

  private isAlreadySubscribed(subscriptionName: string): boolean {
    const isAlreadySubscribed: boolean =
      this._subscriptions.has(subscriptionName);
    return isAlreadySubscribed;
  }
}
