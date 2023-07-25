import styles from '../course.module.scss';

import { CourseLessonCard } from './CourseLessonCard';
import Button from '@studio/ui/components/interactivity/cta/button';

export function CourseLessonsList({ courseId }: { courseId: string }) {
  return (
    <div className={styles.lessonsList}>
      <CourseLessonCard
        key={`course-1`}
        lesson={{ id: '1', courseId, title: 'First lesson' }}
        lessonIndex={0}
        lessonCount={3}
      />
      <CourseLessonCard
        key={`course-2`}
        lesson={{ id: '2', courseId, title: 'Second lesson' }}
        lessonIndex={1}
        lessonCount={3}
      />
      <CourseLessonCard
        key={`course-3`}
        lesson={{ id: '3', courseId, title: 'Third lesson' }}
        lessonIndex={2}
        lessonCount={3}
      />
      <Button
        Label="Create new lesson!"
        Type="Primary"
        Size="Medium"
        Link
        href={`/course/${courseId}/add-lesson`}
      />
    </div>
  );
}
