import { DomainError } from '@studio/commons';
import { ErrorCodes } from '@studio/commons';

export class EnviromentVariableNotFoundError extends DomainError {
  public static causeIsUndefined(varName: string) {
    return new EnviromentVariableNotFoundError({
      message: `The variable ${varName} is required inside the dot env file.`,
      errorCode: ErrorCodes.InternalServerError,
    });
  }
}
