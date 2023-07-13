import { Constructor } from './Constructor';
import { Handler } from './Handler';

export interface QueryBus {
  subscribe<TQuery extends object, TResponse extends object>(
    queryType: Constructor<TQuery>,
    commandHandler: Constructor<Handler<TQuery, TResponse>>
  ): void;
  dispatch<TQuery extends object, TResponse extends object>(
    query: TQuery
  ): Promise<TResponse>;
}
