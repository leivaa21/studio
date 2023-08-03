export const MAX_TAGS_COUNT = 3;

export function validateCourseTagsBusinessRules(tags: string[]): {duplicatedTags: boolean, exceededCount: boolean} {
  const duplicatedTags = 
    tags.some(
      (tag, index) =>
        tags.findIndex((aux) => tag === aux) !== index
    )
  const exceededCount = tags.length > MAX_TAGS_COUNT;

  return {duplicatedTags, exceededCount}
}