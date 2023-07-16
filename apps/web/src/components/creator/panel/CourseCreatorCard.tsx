import { CourseInfoResponse } from '@studio/commons';
import { BiEdit } from 'react-icons/bi';
import styles from './panel.module.scss';

export interface CourseParams {
  course: CourseInfoResponse;
  key?: string;
}

export function CourseCreatorCard({ key, course }: CourseParams) {
  return (
    <div className={styles.card} key={key}>
      <div className={styles['card-header']}>
        <h4 className={styles['card-header-title']}>{course.title}</h4>
        <div className={styles['card-header-buttons']}>
          <BiEdit />
        </div>
      </div>
      <div className={styles['card-body']}>
        <p>{course.description}</p>
      </div>
      <div className={styles['card-footer']}>
        {course.tags.map((tag) => (
          <a key={`${key}>${tag}`}>{tag} </a>
        ))}
      </div>
    </div>
  );
}
