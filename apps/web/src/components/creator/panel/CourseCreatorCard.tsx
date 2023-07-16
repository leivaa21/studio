import { CourseInfoResponse } from '@studio/commons';
import { BiEdit } from 'react-icons/bi';
import styles from './panel.module.scss';
import { CourseTags } from './CourseTags';
import Link from 'next/link';

export interface CourseParams {
  course: CourseInfoResponse;
  key: string;
}

export function CourseCreatorCard({ key, course }: CourseParams) {
  return (
    <div className={styles.card} key={key}>
      <div className={styles['card-header']}>
        <h4 className={styles['card-header-title']}>{course.title}</h4>
        <div className={styles['card-header-buttons']}>
          <Link href={`/creator/edit/${course.id}`}>
            <BiEdit className={styles.edit} />
          </Link>
        </div>
      </div>
      <div className={styles['card-body']}>
        <p>{course.description}</p>
      </div>
      <div className={styles['card-footer']}>
        <CourseTags keyPrefix={key} tags={course.tags} />
      </div>
    </div>
  );
}
