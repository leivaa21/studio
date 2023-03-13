export interface Handler<TSubscriptable, TResponse> {
  execute(subscription: TSubscriptable): Promise<TResponse>;
}
