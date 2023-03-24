import { DependencyContainer, Injectable } from '@studio/dependency-injection';
import { QueryHandler } from '../../application/QueryHandler';
import { Constructor } from '../../domain/Constructor';
import { QueryBus } from '../../domain/QueryBus';

@Injectable()
export class InMemoryQueryBus implements QueryBus {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private _subscriptions: Map<string, QueryHandler<any, any>>;
  constructor() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    this._subscriptions = new Map<string, QueryHandler<any, any>>();
  }
  public subscribe<TQuery extends object, TResponse extends object>(
    queryType: Constructor<TQuery>,
    queryHandler: Constructor<QueryHandler<TQuery, TResponse>>
  ): void {
    const queryName = queryType.name;
    const isAlreadySubscribed = this.isAlreadySubscribed(queryName);
    if (isAlreadySubscribed) {
      throw new Error(`${queryName} is already registered on the QueryBus`);
    }
    const handler =
      DependencyContainer.get<QueryHandler<TQuery, TResponse>>(queryHandler);
    this._subscriptions.set(queryName, handler);
  }

  public async dispatch<TQuery extends object, TResponse extends object>(
    query: TQuery
  ): Promise<TResponse> {
    const queryName = query.constructor.name;
    const isAlreadySubscribed = this.isAlreadySubscribed(queryName);
    if (!isAlreadySubscribed) {
      throw new Error(`${queryName} is not registered on the QueryBus`);
    }

    const handler = this._subscriptions.get(queryName);

    if (!handler) {
      throw new Error(
        `${queryName}'s handler is not registered on the CommandBus`
      );
    }

    return handler.execute(query);
  }

  private isAlreadySubscribed(subscriptionName: string): boolean {
    const isAlreadySubscribed: boolean =
      this._subscriptions.has(subscriptionName);
    return isAlreadySubscribed;
  }
}
