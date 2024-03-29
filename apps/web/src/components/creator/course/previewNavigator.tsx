import Link from 'next/link';
import { useRouter } from 'next/router';

import styles from './course.module.scss';

export interface CoursePreviewNavigatorParams {
  courseId: string;
}

export function CoursePreviewNavigator({
  courseId,
}: CoursePreviewNavigatorParams) {
  const { pathname } = useRouter();

  return (
    <ul className={styles.previewNavigator}>
      <Link
        href={`/creator/course/${courseId}`}
        className={`${styles.link} ${
          pathname === '/creator/course/[courseId]' ? styles.active : undefined
        }`}
      >
        <li
          className={
            pathname === '/creator/course/[courseId]'
              ? styles.active
              : undefined
          }
        >
          Basic Details
        </li>
      </Link>
      <Link href={`/creator/course/${courseId}/lessons`}>
        <li
          className={
            pathname === '/creator/course/[courseId]/lessons'
              ? styles.active
              : undefined
          }
        >
          Lessons
        </li>
      </Link>
      <Link href={`/creator/course/${courseId}/stats`}>
        <li
          className={
            pathname === '/creator/course/[courseId]/stats'
              ? styles.active
              : undefined
          }
        >
          Statistics
        </li>
      </Link>
    </ul>
  );
}
