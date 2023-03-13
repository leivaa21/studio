import { Exception, ExceptionKind } from './Exception';

export class InvalidArgumentException extends Error implements Exception {
  readonly kind: ExceptionKind = 'BAD_REQUEST';

  constructor(className: string, value: string) {
    super(`<${className}> does not allow the value <${value}>`);
  }
}
