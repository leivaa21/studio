import { ValueObject } from '@studio/commons';

export class CourseDescription extends ValueObject<string> {
  static of(value: string): CourseDescription {
    return new CourseDescription(value);
  }
}
