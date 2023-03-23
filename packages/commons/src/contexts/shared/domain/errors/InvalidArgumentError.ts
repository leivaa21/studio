import { ErrorCodes } from '../../../../errors/ErrorCodes';
import { ApiError } from './ApiError';

export class InvalidArgumentError extends ApiError {
  constructor(className: string, value: string) {
    super({
      kind: 'BAD_REQUEST',
      errorCode: ErrorCodes.BadRequest,
      apiStatus: 400,
      message: `<${className}> does not allow the value <${value}>`
    });
  }
}
