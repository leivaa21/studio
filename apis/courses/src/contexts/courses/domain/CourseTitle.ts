import { isCourseTitleValid } from '@studio/commons';
import { ValueObject } from '@studio/commons';
import { InvalidCourseTitleError } from './errors/InvalidCourseTitleError';

export class CourseTitle extends ValueObject<string> {
  static of(value: string): CourseTitle {
    if (!isCourseTitleValid(value)) {
      throw InvalidCourseTitleError.maxLengthExceeded(value);
    }

    return new CourseTitle(value);
  }
}
