import { useErrorBoundary } from 'react-error-boundary';
import { Fragment, useCallback, useEffect, useState } from 'react';

import { LessonResponse } from '@studio/commons';

import styles from '../course.module.scss';
import { MarkdownRenderer } from '../../../markdown/renderer';
import { getLessonById } from '../../../../contexts/lessons/aplication/GetLessonById';

export function PreviewLesson({ lessonId }: { lessonId: string }) {
  const [lesson, setLesson] = useState<LessonResponse>();
  const { showBoundary } = useErrorBoundary();

  const fetchData = useCallback(async () => {
    if (!lessonId) return;

    try {
      const lesson = await getLessonById(lessonId);
      setLesson(lesson);
    } catch (err) {
      showBoundary(err);
    }
  }, [lessonId, showBoundary]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (!lesson) return <Fragment />;

  return (
    <div className={styles.lessonPreview}>
      <h3 className={styles.lessonTitle}>{lesson?.title}</h3>
      <MarkdownRenderer content={lesson?.content} />
    </div>
  );
}
