import Button from '@studio/ui/components/interactivity/cta/button';

import styles from './courses.module.scss';
import { useCourse } from '../../hooks/course/useCourse';
import { MarkdownRenderer } from '../markdown/renderer';
import { useCourseAuthor } from '../../hooks/course/useCourseAuthor';
import { useState } from 'react';
import { Modal } from '@studio/ui/components/modal';
import { createCourseSubscription } from '../../contexts/course-subscription/application/CreateCourseSubscription';
import { getAuthTokenCookie } from '../../lib/cookieUtils';
import { useRouter } from 'next/router';
import { useCheckIfUserIsAlreadySubscribedToCourse } from '../../hooks/course/useCheckIfUserIsAlreadySubscribedToCourse';

export interface CourseContentPreviewParams {
  courseId: string;
}

export function CourseContentPreview({ courseId }: CourseContentPreviewParams) {
  const router = useRouter();

  const course = useCourse(courseId);
  const author = useCourseAuthor(course?.authorId);

  const userAlreadySubscribedToCourse =
    useCheckIfUserIsAlreadySubscribedToCourse(courseId);

  const [subscribeToCourseModalShown, setSubscribeToCourseModalShown] =
    useState<boolean>(false);

  const onSubmitSubscribe = async () => {
    if (!course) return;
    await createCourseSubscription(
      { courseId: course.id },
      getAuthTokenCookie() || ''
    );

    router.push(`/course/${course.id}`);
  };

  return (
    <div className={styles.courseContentPreview}>
      <h2 className={styles.title}>{course?.title}</h2>
      <span className={styles.authorName}>{author?.nickname}</span>
      <MarkdownRenderer content={course?.description} />
      <CourseTags keyPrefix={`${course?.id}-tag`} tags={course?.tags || []} />
      <div className={styles.courseControls}>
        <Button
          Type="Primary"
          Size="Medium"
          Label={
            userAlreadySubscribedToCourse
              ? 'You are already subscribed to this course!'
              : 'Start Course'
          }
          onClick={() => setSubscribeToCourseModalShown(true)}
          disabled={userAlreadySubscribedToCourse}
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
