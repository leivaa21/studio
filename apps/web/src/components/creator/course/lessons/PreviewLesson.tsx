import { MDXRemote } from 'next-mdx-remote';

import styles from '../course.module.scss';
import { useLesson } from '../../../../hooks/course/useLesson';
import { useSerializer } from '../../../../hooks/markdown/useSerializer';

export function PreviewLesson({ lessonId }: { lessonId: string }) {
  const lesson = useLesson(lessonId);
  const content = useSerializer(lesson?.content);

  return (
    <div className={styles.lessonPreview}>
      <h3 className={styles.lessonTitle}>{lesson?.title}</h3>
      {content ? <MDXRemote {...content} /> : undefined}
    </div>
  );
}
