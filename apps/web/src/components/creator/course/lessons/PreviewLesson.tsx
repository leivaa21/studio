import { useEffect, useState } from 'react';
import { getLessonById } from '../../../../contexts/lessons/aplication/GetLessonById';

import { serialize } from 'next-mdx-remote/serialize';
import { MDXRemote, MDXRemoteSerializeResult } from 'next-mdx-remote';

import styles from '../course.module.scss';

export function PreviewLesson({ lessonId }: { lessonId: string }) {
  const [title, setTitle] = useState<string>('');
  const [content, setContent] =
    useState<
      MDXRemoteSerializeResult<Record<string, unknown>, Record<string, unknown>>
    >();

  useEffect(() => {
    if (!lessonId) return;
    getLessonById(lessonId).then((lesson) => {
      setTitle(lesson.title);
      serialize(lesson.content, { mdxOptions: { development: true } }).then(
        (mdxSource) => setContent(mdxSource)
      );
    });
  }, [lessonId]);

  return (
    <div className={styles.lessonPreview}>
      <h3 className={styles.lessonTitle}>{title}</h3>
      {content ? <MDXRemote {...content} /> : undefined}
    </div>
  );
}
