import { Exception } from './Exception';

export class UndefinedArgumentException extends Error implements Exception {
  readonly kind: string = 'BAD_REQUEST';

  constructor(className: string) {
    super(`Value of ${className} must be defined`);
  }
}
