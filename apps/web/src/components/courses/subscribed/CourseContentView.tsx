import styles from '../courses.module.scss';
import { useCourse } from '../../../hooks/course/useCourse';
import { MarkdownRenderer } from '../../markdown/renderer';
import { useCourseAuthor } from '../../../hooks/course/useCourseAuthor';
import { useCourseLessons } from '../../../hooks/course/useCourseLessons';
import Button from '@studio/ui/components/interactivity/cta/button';
import { BsCheck } from 'react-icons/bs';
import { useOwnedCourseSubscriptionByCourseId } from '../../../hooks/course/useOwnedCourseSubscriptionByCourseId';
import { deleteOwnedCourseSubscription } from '../../../contexts/course-subscription/application/DeleteOwnedCourseSubscription';
import { getAuthTokenCookie } from '../../../lib/cookieUtils';
import { useRouter } from 'next/router';
import { Modal } from '@studio/ui/components/modal';
import { useState } from 'react';

export interface CourseContentViewParams {
  courseId: string;
}

export function CourseContentView({ courseId }: CourseContentViewParams) {
  const router = useRouter();

  const [giveUpModalShown, setGiveUpModalShown] = useState<boolean>(false);

  const course = useCourse(courseId);
  const author = useCourseAuthor(course?.authorId);
  const lessons = useCourseLessons(courseId) || [];
  const courseSubscription = useOwnedCourseSubscriptionByCourseId(courseId);

  const onGiveUpSubmit = async () => {
    if (!courseSubscription) return;

    await deleteOwnedCourseSubscription(
      courseSubscription.id,
      getAuthTokenCookie() || ''
    );

    router.push('/dashboard');
  };

  return (
    <div className={styles.courseContentPreview}>
      <h2 className={styles.title}>{course?.title}</h2>
      <span className={styles.authorName}>{author?.nickname}</span>
      <MarkdownRenderer content={course?.description} />
      <CourseTags keyPrefix={`${course?.id}-tag`} tags={course?.tags || []} />
      <CourseLessons
        keyPrefix={`${course?.id}-lesson`}
        lessons={lessons.map((lesson) => {
          return {
            id: lesson.id,
            title: lesson.title,
            courseId: lesson.courseId,
            completed:
              courseSubscription?.completedLessons.includes(lesson.id) || false,
          };
        })}
      />
      <div className={styles.courseControls}>
        <Button
          className={styles.giveUpButton}
          Type="Cancel"
          Label="Give up this course :("
          Size="Small"
          onClick={() => setGiveUpModalShown(true)}
        />
      </div>
      <Modal
        isShown={giveUpModalShown}
        title={'Are you sure you want to give up? :('}
        closeFunction={() => {
          setGiveUpModalShown(false);
        }}
      >
        <div className={styles.controlsCourseModal}>
          <Button
            Type="Cancel"
            Size="Small"
            Label="Give up course"
            onClick={onGiveUpSubmit}
          />
        </div>
      </Modal>
    </div>
  );
}

export function CourseTags(args: { keyPrefix: string; tags: string[] }) {
  return (
    <ul className={styles.tags}>
      {args.tags.map((tag) => (
        <CourseTag key={`${args.keyPrefix}-${tag}`} tag={tag} />
      ))}
    </ul>
  );
}

export function CourseTag({ tag }: { tag: string }) {
  return <li className={styles.tag}>{tag}</li>;
}

type DisplayLessonParameters = {
  id: string;
  title: string;
  completed: boolean;
  courseId: string;
};

export function CourseLessons(args: {
  keyPrefix: string;
  lessons: DisplayLessonParameters[];
}) {
  return (
    <section className={styles.lessonsSection}>
      <h4 className={styles.lessonsSectionTitle}>Lessons</h4>
      <ul className={styles.lessons}>
        {args.lessons.map((lesson) => (
          <CourseLesson key={`${args.keyPrefix}-${lesson}`} lesson={lesson} />
        ))}
      </ul>
    </section>
  );
}

export function CourseLesson({ lesson }: { lesson: DisplayLessonParameters }) {
  const { completed } = lesson;
  const takeLessonLabel = completed ? 'Retake lesson!' : 'Take lesson!';
  const className = `${styles.lesson} ${
    lesson.completed ? styles.completed : ''
  }`;

  return (
    <li className={className}>
      <div className={styles.icons}>
        <LessonAlreadyCompletedIcon isCompleted={lesson.completed} />
      </div>
      <h5 className={styles.lessonTitle}>{lesson.title}</h5>
      <div className={styles.controls}>
        <Button
          Type="Primary"
          Label={takeLessonLabel}
          Size="Small"
          Link
          href={`/course/${lesson.courseId}/lesson/${lesson.id}`}
        />
      </div>
    </li>
  );
}

export function LessonAlreadyCompletedIcon({
  isCompleted,
}: {
  isCompleted: boolean;
}) {
  return (
    <div
      className={`${styles.completedIcon} ${
        isCompleted ? styles.completed : ''
      }`}
    >
      {isCompleted ? <BsCheck /> : undefined}
    </div>
  );
}
