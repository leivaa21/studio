import Button from '@studio/ui/components/interactivity/cta/button';
import styles from '../course.module.scss';
import { BsArrowDownShort, BsArrowUpShort } from 'react-icons/bs';

export interface LessonCardParams {
  lesson: { title: string; id: string; courseId: string };
  lessonIndex: number;
  lessonCount: number;
  key: string;
}

export function CourseLessonCard({
  key,
  lesson,
  lessonIndex,
  lessonCount,
}: LessonCardParams) {
  return (
    <div className={styles.lessonCard} key={key}>
      <div className={styles.lessonOrderControls}>
        <BsArrowUpShort className={lessonIndex === 0 ? styles.hide : ''} />
        <BsArrowDownShort
          className={lessonIndex === lessonCount - 1 ? styles.hide : ''}
        />
      </div>
      <h4 className={styles.lessonTitle}>{lesson.title}</h4>
      <div className={styles.lessonLinks}>
        <Button
          Type="Primary"
          Size="Small"
          Label="VIEW"
          Link
          href={`/course/${lesson.courseId}/lesson/${lesson.id}`}
        />
        <Button
          Type="Primary"
          Size="Small"
          Label="EDIT"
          Link
          href={`/course/${lesson.courseId}/lesson/${lesson.id}/edit`}
        />
      </div>
    </div>
  );
}
