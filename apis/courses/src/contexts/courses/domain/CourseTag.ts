import {
  ValueObject,
  CourseTag as CourseTagEnum,
  InvalidArgumentError,
} from '@studio/commons';

export class CourseTag extends ValueObject<CourseTagEnum> {
  static of(value: string): CourseTag {
    switch (value) {
      case CourseTagEnum.Backend:
        return new CourseTag(CourseTagEnum.Backend);
      case CourseTagEnum.Development:
        return new CourseTag(CourseTagEnum.Development);
      case CourseTagEnum.Frontend:
        return new CourseTag(CourseTagEnum.Frontend);

      case CourseTagEnum.Habits:
        return new CourseTag(CourseTagEnum.Habits);

      case CourseTagEnum.Paradigm:
        return new CourseTag(CourseTagEnum.Paradigm);

      case CourseTagEnum.Personal:
        return new CourseTag(CourseTagEnum.Personal);
      default:
        throw new InvalidArgumentError(CourseTag.name, value);
    }
  }
}
