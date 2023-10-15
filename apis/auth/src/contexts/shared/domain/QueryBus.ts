import { Constructor } from './Constructor';
import { Handler } from './Handler';

export abstract class QueryBus {
  abstract subscribe<TQuery extends object, TResponse extends object>(
    queryType: Constructor<TQuery>,
    commandHandler: Constructor<Handler<TQuery, TResponse>>
  ): void;
  abstract dispatch<TQuery extends object, TResponse extends object>(
    query: TQuery
  ): Promise<TResponse>;
}
