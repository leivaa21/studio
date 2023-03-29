import { DomainError, DomainErrorParams } from "./DomainError";
export type ErrorKind = 'BAD_REQUEST' | 'NOT_FOUND';

export interface ApiErrorParams extends DomainErrorParams {
  apiStatus: number,
  kind: ErrorKind
}

export class ApiError extends DomainError {
  public readonly apiStatus: number;
  public readonly kind: ErrorKind;
  constructor(
    params: ApiErrorParams
    ) {
    super({message: params.message, errorCode: params.errorCode});
    this.apiStatus = params.apiStatus;
    this.kind = params.kind;
  }
}