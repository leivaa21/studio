export const MAX_COURSE_TITLE_LENGTH = 64;

export function isCourseTitleValid(title: string): boolean {
  const maxLengthIsExceeded = title.length > MAX_COURSE_TITLE_LENGTH;
  return !maxLengthIsExceeded;
}