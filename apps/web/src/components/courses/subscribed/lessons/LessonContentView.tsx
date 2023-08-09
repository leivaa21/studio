import styles from '../../courses.module.scss';
import { MarkdownRenderer } from '../../../markdown/renderer';
import { useLesson } from '../../../../hooks/course/useLesson';
import Button from '@studio/ui/components/interactivity/cta/button';
import { useOwnedCourseSubscriptionByCourseId } from '../../../../hooks/course/useOwnedCourseSubscriptionByCourseId';
import { useState } from 'react';
import { Modal } from '@studio/ui/components/modal';
import { markLessonAsCompleted } from '../../../../contexts/course-subscription/application/MarkLessonAsCompleted';
import { getAuthTokenCookie } from '../../../../lib/cookieUtils';
import { useRouter } from 'next/router';

export interface LessonContentViewParams {
  courseId: string;
  lessonId: string;
}

export function LessonContentView({
  courseId,
  lessonId,
}: LessonContentViewParams) {
  const router = useRouter();
  const lesson = useLesson(lessonId);
  const courseSubscription = useOwnedCourseSubscriptionByCourseId(courseId);

  const lessonAlreadyCompleted = !!courseSubscription?.completedLessons.find(
    (lesson) => lesson === lessonId
  );

  const [completeLessonModalShown, setCompleteLessonModalShown] =
    useState<boolean>(false);

  const onSubmitCompleteLesson = async () => {
    await markLessonAsCompleted(lessonId, getAuthTokenCookie() || '');

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
        <div className={styles.subscribeToCourseModal}>
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
