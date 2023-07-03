import { ValueObject } from '@studio/commons';

export class CourseTitle extends ValueObject<string> {
  static of(value: string): CourseTitle {
    return new CourseTitle(value);
  }
}
