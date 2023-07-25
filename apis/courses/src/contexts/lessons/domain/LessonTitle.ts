import { ValueObject } from '@studio/commons';

export class LessonTitle extends ValueObject<string> {
  static of(value: string): LessonTitle {
    return new LessonTitle(value);
  }
}
