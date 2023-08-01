import { CourseInfoResponse } from '@studio/commons';
import { CourseCard } from './CourseCard';

import styles from './courses.module.scss';

export function CourseList({ courses }: { courses: CourseInfoResponse[] }) {
  return (
    <div className={styles.courseList}>
      {courses.map((course) => (
        <CourseCard key={`course-${course.id}`} course={course} />
      ))}
    </div>
  );
}
