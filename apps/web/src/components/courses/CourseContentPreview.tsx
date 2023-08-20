import { useRouter } from 'next/router';
import { Fragment, useCallback, useEffect, useState } from 'react';
import { useErrorBoundary } from 'react-error-boundary';

import Button from '@studio/ui/components/interactivity/cta/button';
import { Modal } from '@studio/ui/components/modal';
import { CourseInfoResponse } from '@studio/commons';

import styles from './courses.module.scss';
import { MarkdownRenderer } from '../markdown/renderer';
import { createCourseSubscription } from '../../contexts/course-subscription/application/CreateCourseSubscription';
import { getAuthTokenCookie } from '../../lib/cookieUtils';
import { getCourseById } from '../../contexts/courses/application/GetCourseById';
import { getUserNicknameById } from '../../contexts/users/application/getUserNicknameById';
import { checkIfUserIsSubscribedToCourse } from '../../contexts/course-subscription/application/CheckIfUserIsSubscribedToCourse';

export interface CourseContentPreviewParams {
  courseId: string;
}

export function CourseContentPreview({ courseId }: CourseContentPreviewParams) {
  const router = useRouter();

  const [token] = useState(getAuthTokenCookie());
  const [course, setCourse] = useState<CourseInfoResponse>();
  const [author, setAuthor] = useState<{ nickname: string }>();
  const [alreadySubscribed, setAlreadySubscribed] = useState<boolean>(false);
  const { showBoundary } = useErrorBoundary();

  const [subscribeToCourseModalShown, setSubscribeToCourseModalShown] =
    useState<boolean>(false);

  const fetchData = useCallback(async () => {
    if (!courseId || !token) return;

    try {
      const course = await getCourseById(courseId);
      const author = await getUserNicknameById(course.authorId);
      const isAlreadySubscribed = await checkIfUserIsSubscribedToCourse(
        courseId,
        token
      );
      setCourse(course);
      setAuthor(author);
      setAlreadySubscribed(isAlreadySubscribed);
    } catch (err) {
      showBoundary(err);
    }
  }, [courseId, token, showBoundary]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (!token || !course || !author) return <Fragment />;

  const onSubmitSubscribe = async () => {
    if (!course) return;
    await createCourseSubscription({ courseId: course.id }, token);

    router.push(`/course/${course.id}`);
  };

  return (
    <div className={styles.courseContentPreview}>
      <h2 className={styles.title}>{course.title}</h2>
      <span className={styles.authorName}>{author.nickname}</span>
      <MarkdownRenderer content={course.description} />
      <CourseTags keyPrefix={`${course.id}-tag`} tags={course.tags || []} />
      <div className={styles.courseControls}>
        <Button
          Type="Primary"
          Size="Medium"
          Label={
            alreadySubscribed
              ? 'You are already subscribed to this course!'
              : 'Start Course'
          }
          onClick={() => setSubscribeToCourseModalShown(true)}
          disabled={alreadySubscribed}
        />
      </div>

      <Modal
        isShown={subscribeToCourseModalShown}
        title={"Subscribe to this course! It's free!"}
        closeFunction={() => {
          setSubscribeToCourseModalShown(false);
        }}
      >
        <div className={styles.controlsCourseModal}>
          <Button
            Type="Primary"
            Size="Small"
            Label="Subscribe to this course!"
            onClick={onSubmitSubscribe}
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
