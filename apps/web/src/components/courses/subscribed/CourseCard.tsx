import Button from '@studio/ui/components/interactivity/cta/button';

import styles from '../courses.module.scss';
import { useCourseAuthor } from '../../../hooks/course/useCourseAuthor';
import { SubscribedCourseInfoResponse } from '@studio/commons';
import { useOwnedCourseSubscriptionByCourseId } from '../../../hooks/course/useOwnedCourseSubscriptionByCourseId';
import { CompletedMark } from './CompletedMark';

export interface CourseCardParams {
  course: SubscribedCourseInfoResponse;
  key: string;
}

export function SubscribedCourseCard({ key, course }: CourseCardParams) {
  const author = useCourseAuthor(course.authorId);
  const courseSubscription = useOwnedCourseSubscriptionByCourseId(course.id);

  return (
    <div className={styles.courseCard} key={key}>
      <div className={styles.courseInfo}>
        <h4 className={styles.title}>{course.title}</h4>
        <CourseTags keyPrefix={key} tags={course.tags} />
        <span className={styles.authorName}>{author?.nickname}</span>
      </div>
      <div className={styles.links}>
        {courseSubscription?.completed ? <CompletedMark /> : undefined}
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
