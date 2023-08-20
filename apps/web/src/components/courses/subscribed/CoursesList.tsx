import { SubscribedCourseInfoResponse } from '@studio/commons';
import { SubscribedCourseCard } from './CourseCard';

import styles from '../courses.module.scss';

export function SubscribedCoursesList({
  courses,
}: {
  courses: SubscribedCourseInfoResponse[];
}) {
  return (
    <div className={styles.courseList}>
      {courses.map((course) => {
        const key = `course-${course.id}`;
        return (
          <SubscribedCourseCard keyPrefix={key} key={key} course={course} />
        );
      })}
    </div>
  );
}
