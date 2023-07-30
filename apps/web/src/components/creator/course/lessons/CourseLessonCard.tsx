import Button from '@studio/ui/components/interactivity/cta/button';
import styles from '../course.module.scss';
import { BsArrowDownShort, BsArrowUpShort } from 'react-icons/bs';
import { Modal } from '@studio/ui/components/modal';
import { useState } from 'react';
import { useRouter } from 'next/router';
import { deleteLesson } from '../../../../contexts/lessons/aplication/DeleteLesson';
import { getAuthTokenCookie } from '../../../../lib/cookieUtils';
import { reorderLessonUp } from '../../../../contexts/lessons/aplication/ReorderLessonUp';
import { reorderLessonDown } from '../../../../contexts/lessons/aplication/ReorderLessonDown';

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
  const [deleteModalShown, setDeleteModalShown] = useState<boolean>(false);
  const [moveUpLessonModalShown, setMoveUpLessonModal] =
    useState<boolean>(false);
  const [moveDownLessonModalShown, setMoveDownLessonModal] =
    useState<boolean>(false);

  const router = useRouter();

  const handleDeleteLesson = async () => {
    await deleteLesson(lesson.id, getAuthTokenCookie() || '');
    router.reload();
  };

  const handleMoveUpLesson = async () => {
    await reorderLessonUp(lesson.id, getAuthTokenCookie() || '');
    router.reload();
  };

  const handleMoveDownLesson = async () => {
    await reorderLessonDown(lesson.id, getAuthTokenCookie() || '');
    router.reload();
  };

  return (
    <div className={styles.lessonCard} key={key}>
      <div className={styles.lessonOrderControls}>
        <BsArrowUpShort
          className={lessonIndex === 0 ? styles.hide : ''}
          onClick={() => setMoveUpLessonModal(true)}
        />
        <BsArrowDownShort
          className={lessonIndex === lessonCount - 1 ? styles.hide : ''}
          onClick={() => setMoveDownLessonModal(true)}
        />
      </div>
      <h4 className={styles.lessonTitle}>{lesson.title}</h4>
      <div className={styles.lessonLinks}>
        <Button
          Type="Primary"
          Size="Small"
          Label="VIEW"
          Link
          href={`/creator/course/${lesson.courseId}/lesson/${lesson.id}`}
        />
        <Button
          Type="Primary"
          Size="Small"
          Label="EDIT"
          Link
          href={`/creator/course/${lesson.courseId}/lesson/${lesson.id}/edit`}
        />
        <Button
          Type="Cancel"
          Size="Small"
          Label="REMOVE"
          onClick={() => setDeleteModalShown(true)}
        />
      </div>
      <Modal
        isShown={moveUpLessonModalShown}
        closeFunction={() => setMoveUpLessonModal(false)}
        title="Move lesson up!"
      >
        <div className={styles.removeLessonModal}>
          <h4>Are you sure to move lesson &quot;{lesson.title}&quot; up?</h4>
          <Button
            Type="Primary"
            Size="Medium"
            Label="MOVE UP!"
            onClick={handleMoveUpLesson}
          />
        </div>
      </Modal>
      <Modal
        isShown={moveDownLessonModalShown}
        closeFunction={() => setMoveDownLessonModal(false)}
        title="Move lesson down!"
      >
        <div className={styles.removeLessonModal}>
          <h4>Are you sure to move lesson &quot;{lesson.title}&quot; down?</h4>
          <Button
            Type="Primary"
            Size="Medium"
            Label="MOVE DOWN!"
            onClick={handleMoveDownLesson}
          />
        </div>
      </Modal>
      <Modal
        isShown={deleteModalShown}
        closeFunction={() => setDeleteModalShown(false)}
        title="Remove lesson"
      >
        <div className={styles.removeLessonModal}>
          <h4>Are you sure to delete lesson &quot;{lesson.title}&quot;?</h4>
          <Button
            Type="Cancel"
            Size="Medium"
            Label="REMOVE"
            onClick={handleDeleteLesson}
          />
        </div>
      </Modal>
    </div>
  );
}
