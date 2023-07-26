import Button from '@studio/ui/components/interactivity/cta/button';
import styles from '../course.module.scss';
import { BsArrowDownShort, BsArrowUpShort } from 'react-icons/bs';
import { Modal } from '@studio/ui/components/modal';
import { useState } from 'react';
import { useRouter } from 'next/router';

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

  const router = useRouter();

  const handleDeleteLesson = () => {
    router.reload();
  };

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
        isShown={deleteModalShown}
        closeFunction={() => setDeleteModalShown(false)}
        title="Remove lesson"
      >
        <div className={styles.removeLessonModal}>
          <h4>Are you sure to delete lesson &quot;{lesson.title}&quot;</h4>
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
