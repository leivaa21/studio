export const enum CourseTag {
  Backend = 'Backend',
  Frontend = 'Frontend',
  Personal = 'Personal',
  Habits = 'Habits',
  Development = 'Development',
  Paradigm = 'Paradigm'
}
export const CourseTagsRecord: Record<CourseTag, string> = {
  [CourseTag.Backend]: 'Backend',
  [CourseTag.Frontend]: 'Frontend',
  [CourseTag.Personal]: 'Personal',
  [CourseTag.Habits]: 'Habits',
  [CourseTag.Development]: 'Development',
  [CourseTag.Paradigm]: 'Paradigm'
}