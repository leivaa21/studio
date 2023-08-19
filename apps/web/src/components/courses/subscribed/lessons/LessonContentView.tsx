import { useRouter } from 'next/router';
import { Fragment, useCallback, useEffect, useState } from 'react';
import { useErrorBoundary } from 'react-error-boundary';

import Button from '@studio/ui/components/interactivity/cta/button';
import { Modal } from '@studio/ui/components/modal';
import {
  CourseSubscriptionInfoResponse,
  LessonResponse,
} from '@studio/commons';

import styles from '../../courses.module.scss';
import { MarkdownRenderer } from '../../../markdown/renderer';
import { markLessonAsCompleted } from '../../../../contexts/course-subscription/application/MarkLessonAsCompleted';
import { getAuthTokenCookie } from '../../../../lib/cookieUtils';
import { getLessonById } from '../../../../contexts/lessons/aplication/GetLessonById';
import { getOwnedCourseSubscriptionByCourseId } from '../../../../contexts/course-subscription/application/GetOwnedCourseSubscriptionByCourseId';

export interface LessonContentViewParams {
  courseId: string;
  lessonId: string;
}

export function LessonContentView({
  courseId,
  lessonId,
}: LessonContentViewParams) {
  const router = useRouter();

  const [lesson, setLesson] = useState<LessonResponse>();
  const [courseSubscription, setCourseSubscription] =
    useState<CourseSubscriptionInfoResponse>();

  const [token] = useState(getAuthTokenCookie());

  const [completeLessonModalShown, setCompleteLessonModalShown] =
    useState<boolean>(false);

  const { showBoundary } = useErrorBoundary();

  const fetchData = useCallback(async () => {
    if (!token || !courseId || !lessonId) return;

    try {
      const lesson = await getLessonById(lessonId);
      const subscription = await getOwnedCourseSubscriptionByCourseId(
        courseId,
        token
      );
      setLesson(lesson);
      setCourseSubscription(subscription);
    } catch (err) {
      showBoundary(err);
    }
  }, [token, courseId, lessonId, showBoundary]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (!lesson || !courseSubscription) return <Fragment />;

  const lessonAlreadyCompleted = !!courseSubscription.completedLessons.find(
    (lesson) => lesson === lessonId
  );

  const onSubmitCompleteLesson = async () => {
    if (!token) return;
    await markLessonAsCompleted(lessonId, token);

    router.push(`/course/${courseId}`);
  };

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
          Label={
            lessonAlreadyCompleted
              ? 'Lesson already completed'
              : 'Mark as completed'
          }
          disabled={lessonAlreadyCompleted}
          Size="Small"
          Type="Primary"
          className={styles.button}
          onClick={() => setCompleteLessonModalShown(true)}
        />
      </div>
      <Modal
        isShown={completeLessonModalShown}
        title={'Mark this lesson as completed?'}
        closeFunction={() => {
          setCompleteLessonModalShown(false);
        }}
      >
        <div className={styles.controlsCourseModal}>
          <Button
            Type="Primary"
            Size="Small"
            Label="Yeah! It's done!"
            onClick={onSubmitCompleteLesson}
          />
        </div>
      </Modal>
    </div>
  );
}
