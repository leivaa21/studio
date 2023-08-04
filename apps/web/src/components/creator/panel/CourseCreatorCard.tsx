import Link from 'next/link';
import { BiChevronRightCircle } from 'react-icons/bi';
import { MDXRemote } from 'next-mdx-remote';

import { CourseInfoResponse } from '@studio/commons';

import styles from './panel.module.scss';
import { CourseTags } from './CourseTags';
import { useSerializer } from '../../../hooks/markdown/useSerializer';

export interface CourseParams {
  course: CourseInfoResponse;
  key: string;
}

export function CourseCreatorCard({ key, course }: CourseParams) {
  const descriptionMdx = useSerializer(course.description);

  return (
    <div className={styles.card} key={key}>
      <div className={styles['card-header']}>
        <h4 className={styles['card-header-title']}>{course.title}</h4>
        <div className={styles['card-header-buttons']}>
          <Link href={`/creator/course/${course.id}`}>
            <BiChevronRightCircle className={styles.edit} />
          </Link>
        </div>
      </div>
      <div className={styles['card-body']}>
        {descriptionMdx ? <MDXRemote {...descriptionMdx} /> : undefined}
      </div>
      <div className={styles['card-footer']}>
        <CourseTags keyPrefix={key} tags={course.tags} />
      </div>
    </div>
  );
}
