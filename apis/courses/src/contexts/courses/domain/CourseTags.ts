import {
  InvalidArgumentError,
  validateCourseTagsBusinessRules,
} from '@studio/commons';
import { CourseTag } from './CourseTag';

export class CourseTags {
  constructor(private readonly tags: CourseTag[]) {}

  static of(tags: CourseTag[]): CourseTags {
    const { duplicatedTags, exceededCount } = validateCourseTagsBusinessRules(
      tags.map((tag) => tag.value)
    );

    if (duplicatedTags || exceededCount) {
      throw new InvalidArgumentError(
        CourseTags.name,
        tags.map((tag) => tag.value).toString()
      );
    }

    return new CourseTags(tags);
  }

  public get values(): string[] {
    return this.tags.map((tag) => tag.value);
  }

  public equals(otherTags: CourseTags): boolean {
    return (
      this.values.every((tag) => otherTags.values.includes(tag)) &&
      otherTags.values.every((tag) => this.values.includes(tag))
    );
  }
}
