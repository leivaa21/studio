import { Exception } from './Exception';

export class InvalidArgumentException extends Error implements Exception {
  readonly kind: string = 'BAD_REQUEST';

  constructor(className: string, value: string) {
    super(`<${className}> does not allow the value <${value}>`);
  }
}
