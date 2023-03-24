import { Handler } from '../domain/Handler';

export type QueryHandler<TQuery, TResponse> = Handler<TQuery, TResponse>;
