import styles from '../course.module.scss';
import { useLesson } from '../../../../hooks/course/useLesson';
import { MarkdownRenderer } from '../../../markdown/renderer';

export function PreviewLesson({ lessonId }: { lessonId: string }) {
  const lesson = useLesson(lessonId);

  return (
    <div className={styles.lessonPreview}>
      <h3 className={styles.lessonTitle}>{lesson?.title}</h3>
      <MarkdownRenderer content={lesson?.content} />
    </div>
  );
}
