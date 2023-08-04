import { validateCourseTagsBusinessRules } from '@studio/commons';
import { CourseTag } from './CourseTag';
import { InvalidCourseTagsError } from './errors/InvalidCourseTagsError';

export class CourseTags {
  constructor(private readonly tags: CourseTag[]) {}

  static of(tags: CourseTag[]): CourseTags {
    const tagsAsPrimitives = tags.map((tag) => tag.value);
    const { duplicatedTags, exceededCount } =
      validateCourseTagsBusinessRules(tagsAsPrimitives);

    if (duplicatedTags) {
      throw InvalidCourseTagsError.hasDuplicatedTags(tagsAsPrimitives);
    }

    if (exceededCount) {
      throw InvalidCourseTagsError.hasExceededTagCountLimit(tagsAsPrimitives);
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
