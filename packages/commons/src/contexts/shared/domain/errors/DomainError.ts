import { ErrorCodes } from "../../../../errors/ErrorCodes";

export interface DomainErrorParams {
  errorCode: ErrorCodes,
  message: string,
}

export class DomainError extends Error {
  public readonly errorCode: string;
  
  constructor(params: DomainErrorParams) {
    super(params.message)
    this.errorCode = params.errorCode;
  }
}