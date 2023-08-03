export const MAX_LESSON_TITLE_LENGTH = 64;

export function isLessonTitleValid(title: string): boolean {
  const maxLengthIsExceeded = title.length > MAX_LESSON_TITLE_LENGTH;
  return !maxLengthIsExceeded;
}