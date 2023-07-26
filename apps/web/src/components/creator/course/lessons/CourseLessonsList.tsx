import { useEffect, useState } from 'react';
import styles from '../course.module.scss';

import { CourseLessonCard } from './CourseLessonCard';
import Button from '@studio/ui/components/interactivity/cta/button';
import { LessonInfoResponse } from '@studio/commons';
import { getLessonsByCourseId } from '../../../../contexts/lessons/aplication/GetLessonsByCourseId';

export function CourseLessonsList({ courseId }: { courseId: string }) {
  const [lessons, setLessons] = useState<LessonInfoResponse[]>([]);

  useEffect(() => {
    if (!courseId) return;

    getLessonsByCourseId(courseId).then((lessons) => {
      setLessons(lessons);
    });
  }, [courseId]);

  return (
    <div className={styles.lessonsList}>
      {lessons.map((lesson, index) => (
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
