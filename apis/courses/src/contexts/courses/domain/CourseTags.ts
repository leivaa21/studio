import { CourseTag } from './CourseTag';

export class CourseTags {
  constructor(private readonly tags: CourseTag[]) {}

  static of(tags: CourseTag[]): CourseTags {
    return new CourseTags(tags);
  }

  public get values(): string[] {
    return this.tags.map((tag) => tag.value);
  }
}
