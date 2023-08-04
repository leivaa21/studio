import { useCallback, useEffect, useState } from 'react';

import Button from '@studio/ui/components/interactivity/cta/button';

import { getUserNicknameById } from '../../contexts/users/application/getUserNicknameById';
import styles from './courses.module.scss';
import { useCourse } from '../../hooks/course/useCourse';
import { MarkdownRenderer } from '../markdown/renderer';

export interface CourseContentPreviewParams {
  courseId: string;
}

export function CourseContentPreview({ courseId }: CourseContentPreviewParams) {
  const [authorName, setAuthorName] = useState<string>();
  const course = useCourse(courseId);

  const fetchInfo = useCallback(async () => {
    if (!course) return;
    const { nickname } = await getUserNicknameById(course.authorId);

    setAuthorName(nickname);
  }, [course]);

  useEffect(() => {
    fetchInfo();
  }, [fetchInfo]);

  return (
    <div className={styles.courseContentPreview}>
      <h2 className={styles.title}>{course?.title}</h2>
      <span className={styles.authorName}>{authorName}</span>
      <MarkdownRenderer content={course?.description} />
      <CourseTags keyPrefix={`${course?.id}-tag`} tags={course?.tags || []} />
      <div className={styles.courseControls}>
        <Button Type="Primary" Size="Medium" Label="Start Course" />
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
