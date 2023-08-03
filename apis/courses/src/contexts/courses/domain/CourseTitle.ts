import { InvalidArgumentError } from '@studio/commons';
import { isCourseTitleValid } from '@studio/commons';
import { ValueObject } from '@studio/commons';

export class CourseTitle extends ValueObject<string> {
  static of(value: string): CourseTitle {
    if (!isCourseTitleValid(value)) {
      throw new InvalidArgumentError(this.name, value);
    }

    return new CourseTitle(value);
  }
}
