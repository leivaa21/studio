import { DomainError } from "@studio/commons/dist/contexts/shared/domain/errors/DomainError";
import { ErrorCodes } from "@studio/commons/dist/errors/ErrorCodes";

export class EnviromentVariableNotFoundError extends DomainError {
  public static causeIsUndefined(varName: string) {
    return new EnviromentVariableNotFoundError({
      message: `The variable ${varName} is required inside the dot env file.`,
      errorCode: ErrorCodes.InternalServerError
    })
  }
}