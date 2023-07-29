import Link from 'next/link';

import { serialize } from 'next-mdx-remote/serialize';
import { MDXRemote, MDXRemoteSerializeResult } from 'next-mdx-remote';

import { CourseInfoResponse } from '@studio/commons';
import { BiChevronRightCircle } from 'react-icons/bi';
import styles from './panel.module.scss';
import { CourseTags } from './CourseTags';
import { useEffect, useState } from 'react';

export interface CourseParams {
  course: CourseInfoResponse;
  key: string;
}

export function CourseCreatorCard({ key, course }: CourseParams) {
  const [descriptionMdx, setDescriptionMdx] =
    useState<
      MDXRemoteSerializeResult<Record<string, unknown>, Record<string, unknown>>
    >();
  useEffect(() => {
    serialize(course.description, { mdxOptions: { development: true } }).then(
      (mdxSource) => setDescriptionMdx(mdxSource)
    );
  });

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
