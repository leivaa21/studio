import { CourseInfoResponse } from '@studio/commons';

import styles from './panel.module.scss';

import { CourseCreatorCard } from './CourseCreatorCard';

export interface CourseCreatorGridParams {
  readonly courses: CourseInfoResponse[];
}

export function CourseCreatorGrid({ courses }: CourseCreatorGridParams) {
  return (
    <div className={styles.grid}>
      {courses.map((course) => {
        const key = `course-${course.id}`;
        return <CourseCreatorCard key={key} keyPrefix={key} course={course} />;
      })}
    </div>
  );
}
