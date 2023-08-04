import { useCallback, useEffect, useState } from 'react';
import { MDXRemote, MDXRemoteSerializeResult } from 'next-mdx-remote';
import { serialize } from 'next-mdx-remote/serialize';

import Button from '@studio/ui/components/interactivity/cta/button';

import { getUserNicknameById } from '../../contexts/users/application/getUserNicknameById';
import styles from './courses.module.scss';
import { useCourse } from '../../hooks/course/useCourse';

export interface CourseContentPreviewParams {
  courseId: string;
}

export function CourseContentPreview({ courseId }: CourseContentPreviewParams) {
  const [authorName, setAuthorName] = useState<string>();
  const course = useCourse(courseId);

  const [descriptionMdx, setDescriptionMdx] =
    useState<
      MDXRemoteSerializeResult<Record<string, unknown>, Record<string, unknown>>
    >();

  const fetchInfo = useCallback(async () => {
    if (!course) return;
    const { nickname } = await getUserNicknameById(course.authorId);

    const mdxSource = await serialize(course.description, {
      mdxOptions: { development: true },
    });

    setAuthorName(nickname);
    setDescriptionMdx(mdxSource);
  }, [course]);

  useEffect(() => {
    fetchInfo();
  }, [fetchInfo]);

  return (
    <div className={styles.courseContentPreview}>
      <h2 className={styles.title}>{course?.title}</h2>
      <span className={styles.authorName}>{authorName}</span>
      {descriptionMdx ? <MDXRemote {...descriptionMdx} /> : undefined}
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
