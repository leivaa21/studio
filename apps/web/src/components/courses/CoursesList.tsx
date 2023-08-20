import { CourseInfoResponse } from '@studio/commons';
import { CourseCard } from './CourseCard';

import styles from './courses.module.scss';

export function CourseList({ courses }: { courses: CourseInfoResponse[] }) {
  return (
    <div className={styles.courseList}>
      {courses.map((course) => {
        const keyPrefix = `course-${course.id}`;
        return (
          <CourseCard keyPrefix={keyPrefix} key={keyPrefix} course={course} />
        );
      })}
    </div>
  );
}
