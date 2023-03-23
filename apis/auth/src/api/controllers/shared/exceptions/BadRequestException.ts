import { ErrorKind } from '@studio/commons/dist/contexts/shared/domain/errors/ApiError';

export class BadRequestException extends Error {
  public readonly kind: ErrorKind = 'BAD_REQUEST';
}
