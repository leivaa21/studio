import { ValueObject } from '@studio/commons';

export class LessonContent extends ValueObject<string> {
  static of(value: string): LessonContent {
    return new LessonContent(value);
  }
}
