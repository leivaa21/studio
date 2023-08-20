import Link from 'next/link';
import { BiChevronRightCircle } from 'react-icons/bi';

import { CourseInfoResponse } from '@studio/commons';

import styles from './panel.module.scss';
import { CourseTags } from './CourseTags';
import { MarkdownRenderer } from '../../markdown/renderer';

export interface CourseParams {
  course: CourseInfoResponse;
  keyPrefix: string;
}

export function CourseCreatorCard({ keyPrefix, course }: CourseParams) {
  return (
    <div className={styles.card}>
      <div className={styles['card-header']}>
        <h4 className={styles['card-header-title']}>{course.title}</h4>
        <div className={styles['card-header-buttons']}>
          <Link href={`/creator/course/${course.id}`}>
            <BiChevronRightCircle className={styles.edit} />
          </Link>
        </div>
      </div>
      <div className={styles['card-body']}>
        <MarkdownRenderer content={course.description} />
      </div>
      <div className={styles['card-footer']}>
        <CourseTags keyPrefix={keyPrefix} tags={course.tags} />
      </div>
    </div>
  );
}
