const MAX_LENGTH = 64;

export function isCourseTitleValid(title: string): boolean {
  const maxLengthIsExceeded = title.length > MAX_LENGTH;
  return !maxLengthIsExceeded;
}