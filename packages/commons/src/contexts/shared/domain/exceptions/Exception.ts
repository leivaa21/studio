export type ExceptionKind = 'BAD_REQUEST' | 'NOT_FOUND';

export interface Exception {
  readonly kind: ExceptionKind;
  readonly message: string;
}
