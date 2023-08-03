import {
  InvalidArgumentError,
  ValueObject,
  isLessonTitleValid,
} from '@studio/commons';

export class LessonTitle extends ValueObject<string> {
  static of(value: string): LessonTitle {
    if (!isLessonTitleValid(value)) {
      throw new InvalidArgumentError(this.name, value);
    }

    return new LessonTitle(value);
  }
}
