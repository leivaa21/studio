import { CourseInfoResponse } from '@studio/commons';

import styles from './panel.module.scss';

import { CourseCreatorCard } from './CourseCreatorCard';

export interface CourseCreatorGridParams {
  readonly courses: CourseInfoResponse[];
}

export function CourseCreatorGrid({ courses }: CourseCreatorGridParams) {
  return (
    <div className={styles.grid}>
      {courses.map((course) => (
        <CourseCreatorCard key={`course-${course.id}`} course={course} />
      ))}
    </div>
  );
}
