import { ValueObject, isLessonTitleValid } from '@studio/commons';
import { InvalidLessonTitleError } from './errors/InvalidLessonTitleError';

export class LessonTitle extends ValueObject<string> {
  static of(value: string): LessonTitle {
    if (!isLessonTitleValid(value)) {
      throw new InvalidLessonTitleError(this.name);
    }

    return new LessonTitle(value);
  }
}
