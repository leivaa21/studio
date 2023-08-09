import styles from '../../courses.module.scss';
import { MarkdownRenderer } from '../../../markdown/renderer';
import { useLesson } from '../../../../hooks/course/useLesson';
import Button from '@studio/ui/components/interactivity/cta/button';

export interface LessonContentViewParams {
  courseId: string;
  lessonId: string;
}

export function LessonContentView({
  courseId,
  lessonId,
}: LessonContentViewParams) {
  const lesson = useLesson(lessonId);

  return (
    <div className={styles.lessonContentPreview}>
      <h2 className={styles.title}>{lesson?.title}</h2>
      <MarkdownRenderer content={lesson?.content} />
      <div className={styles.lessonControls}>
        <Button
          Label="Back to course"
          Size="Small"
          Type="Secondary"
          Link
          href={`/course/${courseId}`}
          className={styles.button}
        />
        <Button
          Label="Mark as completed"
          Size="Small"
          Type="Primary"
          className={styles.button}
        />
      </div>
    </div>
  );
}
