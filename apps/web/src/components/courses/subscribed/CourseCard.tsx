import { Fragment, useCallback, useEffect, useState } from 'react';
import { useErrorBoundary } from 'react-error-boundary';

import Button from '@studio/ui/components/interactivity/cta/button';
import {
  CourseSubscriptionInfoResponse,
  SubscribedCourseInfoResponse,
} from '@studio/commons';

import styles from '../courses.module.scss';
import { CompletedMark } from './CompletedMark';
import { getUserNicknameById } from '../../../contexts/users/application/getUserNicknameById';
import { getOwnedCourseSubscriptionByCourseId } from '../../../contexts/course-subscription/application/GetOwnedCourseSubscriptionByCourseId';
import { getAuthTokenCookie } from '../../../lib/cookieUtils';

export interface CourseCardParams {
  course: SubscribedCourseInfoResponse;
  key: string;
}

export function SubscribedCourseCard({ key, course }: CourseCardParams) {
  const [author, setAuthor] = useState<{ nickname: string }>();
  const [courseSubscription, setCourseSubscription] =
    useState<CourseSubscriptionInfoResponse>();
  const { showBoundary } = useErrorBoundary();

  const fetchData = useCallback(async () => {
    try {
      const token = getAuthTokenCookie();
      if (!course || !token) return;

      const author = await getUserNicknameById(course.authorId);
      const courseSubscription = await getOwnedCourseSubscriptionByCourseId(
        course.id,
        token
      );
      setAuthor(author);
      setCourseSubscription(courseSubscription);
    } catch (err) {
      showBoundary(err);
    }
  }, [course, showBoundary]);

  useEffect(() => {
    fetchData();
  });

  if (!course || !author || !courseSubscription) return <Fragment />;

  return (
    <div className={styles.courseCard} key={key}>
      <div className={styles.courseInfo}>
        <h4 className={styles.title}>{course.title}</h4>
        <CourseTags keyPrefix={key} tags={course.tags} />
        <span className={styles.authorName}>{author.nickname}</span>
      </div>
      <div className={styles.links}>
        {courseSubscription.completedAt ? (
          <CompletedMark courseId={course.id} />
        ) : undefined}
        <Button
          Type="Primary"
          Size="Medium"
          Label="VIEW"
          Link
          href={`/course/${course.id}`}
        />
      </div>
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
