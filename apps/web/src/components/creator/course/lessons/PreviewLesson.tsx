import { useEffect, useState } from 'react';

import { serialize } from 'next-mdx-remote/serialize';
import { MDXRemote, MDXRemoteSerializeResult } from 'next-mdx-remote';

import styles from '../course.module.scss';
import { useLesson } from '../../../../hooks/course/useLesson';

export function PreviewLesson({ lessonId }: { lessonId: string }) {
  const lesson = useLesson(lessonId);
  const [content, setContent] =
    useState<
      MDXRemoteSerializeResult<Record<string, unknown>, Record<string, unknown>>
    >();

  useEffect(() => {
    if (!lesson) return;

    serialize(lesson.content, { mdxOptions: { development: true } }).then(
      (mdxSource) => setContent(mdxSource)
    );
  }, [lesson]);

  return (
    <div className={styles.lessonPreview}>
      <h3 className={styles.lessonTitle}>{lesson?.title}</h3>
      {content ? <MDXRemote {...content} /> : undefined}
    </div>
  );
}
