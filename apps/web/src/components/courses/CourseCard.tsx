import { Fragment, useCallback, useEffect, useState } from 'react';
import { useErrorBoundary } from 'react-error-boundary';

import Button from '@studio/ui/components/interactivity/cta/button';

import styles from './courses.module.scss';
import { getUserNicknameById } from '../../contexts/users/application/getUserNicknameById';

export interface CourseCardParams {
  course: { id: string; title: string; authorId: string; tags: string[] };
  key: string;
}

export function CourseCard({ key, course }: CourseCardParams) {
  const [author, setAuthor] = useState<{ nickname: string }>();
  const { showBoundary } = useErrorBoundary();

  const fetchData = useCallback(async () => {
    if (!course) return;

    try {
      const author = await getUserNicknameById(course.authorId);
      setAuthor(author);
    } catch (err) {
      showBoundary(err);
    }
  }, [course, showBoundary]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (!author || !course) return <Fragment />;

  return (
    <div className={styles.courseCard} key={key}>
      <div className={styles.courseInfo}>
        <h4 className={styles.title}>{course.title}</h4>
        <CourseTags keyPrefix={key} tags={course.tags} />
        <span className={styles.authorName}>{author?.nickname}</span>
      </div>
      <div className={styles.links}>
        <Button
          Type="Primary"
          Size="Medium"
          Label="VIEW"
          Link
          href={`/course/${course.id}/landing`}
        />
      </div>
    </div>
  );
}

export function CourseTags(args: { keyPrefix: string; tags: string[] }) {
  return (
    <ul className={styles.tags}>
      {args.tags.map((tag) => (
        <CourseTag key={`${args.keyPrefix}-${tag}`} tag={tag} />
      ))}
    </ul>
  );
}

export function CourseTag({ tag }: { tag: string }) {
  return <li className={styles.tag}>{tag}</li>;
}
