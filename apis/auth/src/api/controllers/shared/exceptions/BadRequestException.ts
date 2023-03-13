import { ExceptionKind } from '@studio/commons/dist/contexts/shared/domain/exceptions/Exception';
export class BadRequestException extends Error {
  public readonly kind: ExceptionKind = 'BAD_REQUEST';
}
