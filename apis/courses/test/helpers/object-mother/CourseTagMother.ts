import { CourseTagsRecord, MAX_TAGS_COUNT } from '@studio/commons';
import { NumberMother } from './NumberMother';
import { CourseTag } from '../../../src/contexts/courses/domain/CourseTag';
import { CourseTags } from '../../../src/contexts/courses/domain/CourseTags';

export class CourseTagMother {
  public static random(): CourseTag {
    const index = NumberMother.random({
      min: 0,
      max: Object.keys(CourseTagsRecord).length - 1,
    });

    return CourseTag.of(Object.keys(CourseTagsRecord)[index]);
  }
  public static randomTags(): CourseTags {
    const initializerArray = new Array(
      NumberMother.random({ min: 0, max: MAX_TAGS_COUNT })
    );

    const tagsArray = initializerArray
      .map(() => CourseTagMother.random())
      .filter((tag, index, arr) => isFirstAppearance(tag, index, arr));

    return CourseTags.of(tagsArray);
  }
}

function isFirstAppearance(
  tag: CourseTag,
  index: number,
  array: Array<CourseTag>
): boolean {
  return array.findIndex((aux) => tag.value === aux.value) === index;
}
