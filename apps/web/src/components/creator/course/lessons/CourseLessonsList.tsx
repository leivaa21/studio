import styles from '../course.module.scss';

import { CourseLessonCard } from './CourseLessonCard';
import Button from '@studio/ui/components/interactivity/cta/button';
import { useCourseLessons } from '../../../../hooks/course/useCourseLessons';

export function CourseLessonsList({ courseId }: { courseId: string }) {
  const lessons = useCourseLessons(courseId);

  return (
    <div className={styles.lessonsList}>
      {lessons?.map((lesson, index) => (
        <CourseLessonCard
          key={`lesson-${lesson.id}`}
          lesson={lesson}
          lessonIndex={index}
          lessonCount={lessons.length}
        />
      ))}
      <Button
        Label="Create new lesson!"
        Type="Primary"
        Size="Medium"
        Link
        href={`/creator/course/${courseId}/add-lesson`}
      />
    </div>
  );
}
