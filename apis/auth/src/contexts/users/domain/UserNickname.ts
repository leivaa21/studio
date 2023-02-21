import { ValueObject } from "../../shared/domain/valueObjects/ValueObject";
import UserNicknameLenghtExceeded from "./exceptions/UserNicknameLengthExceeded";

class UserNickname extends ValueObject<string> {
  static MAX_LENGTH = 16; 
  constructor(value: string) {
    super(value);
    this.assertLength();
  }

  assertLength(): void {
    if(this.value.length > UserNickname.MAX_LENGTH) {
      throw new UserNicknameLenghtExceeded(this.value);
    }
  }
}

export default UserNickname;