import { Fragment, useCallback, useEffect, useState } from 'react';
import { useErrorBoundary } from 'react-error-boundary';

import { LessonInfoResponse } from '@studio/commons';
import Button from '@studio/ui/components/interactivity/cta/button';

import styles from '../course.module.scss';
import { CourseLessonCard } from './CourseLessonCard';
import { getLessonsByCourseId } from '../../../../contexts/lessons/aplication/GetLessonsByCourseId';

export function CourseLessonsList({ courseId }: { courseId: string }) {
  const [lessons, setLessons] = useState<LessonInfoResponse[]>();
  const { showBoundary } = useErrorBoundary();

  const fetchData = useCallback(async () => {
    if (!courseId) return;

    try {
      const lessons = await getLessonsByCourseId(courseId);
      setLessons(lessons);
    } catch (err) {
      showBoundary(err);
    }
  }, [courseId, showBoundary]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (!lessons) return <Fragment />;

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
