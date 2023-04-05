import { ErrorCodes } from "../../../../errors/ErrorCodes";
import { ApiError } from "../../../shared/domain/errors/ApiError";
import { Password } from "../Password";

export class InvalidPasswordError extends ApiError {
  constructor(errorCode: ErrorCodes, message: string) {
    super({
      kind: 'BAD_REQUEST',
      errorCode,
      apiStatus: 400,
      message,
    });
  }
  public static causePasswordIsTooShort(password: string) {
    return new this(
      ErrorCodes.PasswordTooShort,
      `Passwords can't be shorter than ${Password.MIN_LENGTH} => <${password}>`
    );
  }
  public static causePasswordShouldContainLowercase(password: string) {
    return new this(
      ErrorCodes.PasswordShouldContainLowercase,
      `Passwords should include lowercase letters => <${password}>`
    );
  }

  public static causePasswordShouldContainUppercase(password: string) {
    return new this(
      ErrorCodes.PasswordShouldContainUppercase,
      `Passwords should include uppercase letters => <${password}>`
    );
  }

  public static causePasswordShouldContainNumber(password: string) {
    return new this(
      ErrorCodes.PasswordShouldContainNumber,
      `Passwords should include numbers => <${password}>`
    );
  }

  public static causePasswordShouldContainSymbol(password: string) {
    return new this(
      ErrorCodes.PasswordShouldContainSymbol,
      `Passwords should include symbols => <${password}>`
    );
  }

  public static causePasswordContainsSpaces(password: string) {
    return new this(
      ErrorCodes.InvalidPassword,
      `Passwords should not include spaces => <${password}>`
    );

  }
}
