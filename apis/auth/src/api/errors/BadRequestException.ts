import { ErrorKind } from '@studio/commons';

export class BadRequestException extends Error {
  public readonly kind: ErrorKind = 'BAD_REQUEST';
}
