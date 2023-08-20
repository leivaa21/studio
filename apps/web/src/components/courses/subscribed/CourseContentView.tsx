import { useRouter } from 'next/router';
import { Fragment, useCallback, useEffect, useState } from 'react';
import { BsCheck } from 'react-icons/bs';

import { Modal } from '@studio/ui/components/modal';
import Button from '@studio/ui/components/interactivity/cta/button';

import styles from '../courses.module.scss';

import { MarkdownRenderer } from '../../markdown/renderer';
import { deleteOwnedCourseSubscription } from '../../../contexts/course-subscription/application/DeleteOwnedCourseSubscription';
import { getAuthTokenCookie } from '../../../lib/cookieUtils';
import { CompletedMark } from './CompletedMark';
import { getCourseById } from '../../../contexts/courses/application/GetCourseById';
import { getUserNicknameById } from '../../../contexts/users/application/getUserNicknameById';
import { getLessonsByCourseId } from '../../../contexts/lessons/aplication/GetLessonsByCourseId';
import { getOwnedCourseSubscriptionByCourseId } from '../../../contexts/course-subscription/application/GetOwnedCourseSubscriptionByCourseId';
import { useErrorBoundary } from 'react-error-boundary';
import {
  CourseInfoResponse,
  CourseSubscriptionInfoResponse,
} from '@studio/commons';

export interface CourseContentViewParams {
  courseId: string;
}

type SubscribedCourseLessonsParams = {
  id: string;
  title: string;
  completed: boolean;
  courseId: string;
};

export function CourseContentView({ courseId }: CourseContentViewParams) {
  const router = useRouter();

  const { showBoundary } = useErrorBoundary();

  const fetchSubscribedCourse = useCallback(async () => {
    try {
      const token = getAuthTokenCookie();
      if (!courseId || !token) return;

      const subscription = await getOwnedCourseSubscriptionByCourseId(
        courseId,
        token
      );
      const course = await getCourseById(courseId);
      const author = await getUserNicknameById(course.authorId);
      const courseLessons = await getLessonsByCourseId(courseId);

      const lessons = courseLessons.map((lesson) => ({
        id: lesson.id,
        title: lesson.title,
        courseId: lesson.courseId,
        completed: subscription.completedLessons.includes(lesson.id) || false,
      }));

      setCourse(course);
      setAuthor(author);
      setLessons(lessons);
      setCourseSubscription(subscription);
    } catch (error) {
      showBoundary(error);
    }
  }, [courseId, showBoundary]);

  const [giveUpModalShown, setGiveUpModalShown] = useState<boolean>(false);

  const [course, setCourse] = useState<CourseInfoResponse>();
  const [author, setAuthor] = useState<{ nickname: string }>();
  const [lessons, setLessons] = useState<SubscribedCourseLessonsParams[]>();
  const [courseSubscription, setCourseSubscription] =
    useState<CourseSubscriptionInfoResponse>();

  useEffect(() => {
    fetchSubscribedCourse();
  }, [courseId, fetchSubscribedCourse]);

  if (!course || !author || !lessons || !courseSubscription) {
    return <Fragment />;
  }

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
      {courseSubscription?.completedAt ? (
        <CompletedMark courseId={courseId} />
      ) : undefined}
      <h2 className={styles.title}>{course?.title}</h2>
      <span className={styles.authorName}>{author?.nickname}</span>
      <MarkdownRenderer content={course?.description} />
      <CourseTags keyPrefix={`${course?.id}-tag`} tags={course?.tags || []} />
      <CourseLessons keyPrefix={`${course?.id}-lesson`} lessons={lessons} />
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
          <CourseLesson
            key={`${args.keyPrefix}-${lesson.id}`}
            lesson={lesson}
          />
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
